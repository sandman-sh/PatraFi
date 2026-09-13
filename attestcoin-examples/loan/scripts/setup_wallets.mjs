import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import ethers from patrafi's installed dependencies
const ethersPath = path.resolve(__dirname, '../../../patrafi/node_modules/ethers/lib.esm/index.js');
const { ethers } = await import(`file:///${ethersPath.replace(/\\/g, '/')}`);

const CC3_RPC = 'https://rpc.cc3-testnet.creditcoin.network/';
const SEPOLIA_RPC = 'https://ethereum-sepolia-rpc.publicnode.com';

const cc3Provider = new ethers.JsonRpcProvider(CC3_RPC);
const sepoliaProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

const envPath = path.resolve(__dirname, '../.env');
const exampleEnvPath = path.resolve(__dirname, '../.env.example');

console.log('\n======================================================');
console.log('🪙  PATRAFI / CREDITCOIN CC3 TESTNET WALLET MANAGER');
console.log('======================================================\n');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else if (fs.existsSync(exampleEnvPath)) {
  envContent = fs.readFileSync(exampleEnvPath, 'utf8');
}

function parseEnv(src) {
  const map = {};
  for (const line of src.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      map[key] = val;
    }
  }
  return map;
}

const envVars = parseEnv(envContent);

function getOrCreateWallet(keyName, label) {
  let pk = envVars[keyName];
  if (!pk || pk.startsWith('<') || pk.length < 64) {
    const newWallet = ethers.Wallet.createRandom();
    pk = newWallet.privateKey;
    envVars[keyName] = pk;
    console.log(`[+] Generated fresh ${label} key: ${newWallet.address}`);
  }
  return new ethers.Wallet(pk);
}

const deployerWallet = getOrCreateWallet('CREDITCOIN_WALLET_PRIVATE_KEY', 'Deployer');
const lenderWallet = getOrCreateWallet('LENDER_WALLET_PRIVATE_KEY', 'Lender');
const borrowerWallet = getOrCreateWallet('BORROWER_WALLET_PRIVATE_KEY', 'Borrower');

// Save updated .env
const updatedEnv = `# Loan example environment - Configured by PatraFi E2E Setup
SOURCE_CHAIN_KEY=1
PROOF_BUILDER_URL="https://prover.cc3-testnet.creditcoin.network"
CREDITCOIN_RPC_URL="https://rpc.cc3-testnet.creditcoin.network"
SOURCE_CHAIN_RPC_URL="${envVars.SOURCE_CHAIN_RPC_URL || SEPOLIA_RPC}"
EVM_V1_DECODER_LIBRARY_ADDRESS="0x04B9ae8562D8Cc5bbbBbBB759080dDC30B56D18B"

CREDITCOIN_WALLET_PRIVATE_KEY="${deployerWallet.privateKey}"
LENDER_WALLET_PRIVATE_KEY="${lenderWallet.privateKey}"
BORROWER_WALLET_PRIVATE_KEY="${borrowerWallet.privateKey}"

ASC_LOAN_MANAGER_CONTRACT_ADDRESS="${envVars.ASC_LOAN_MANAGER_CONTRACT_ADDRESS || ''}"
SOURCE_CHAIN_LOAN_CONTRACT_ADDRESS="${envVars.SOURCE_CHAIN_LOAN_CONTRACT_ADDRESS || ''}"
SOURCE_CHAIN_ERC20_CONTRACT_ADDRESS="${envVars.SOURCE_CHAIN_ERC20_CONTRACT_ADDRESS || ''}"
`;

fs.writeFileSync(envPath, updatedEnv, 'utf8');
console.log(`[✓] Saved configuration to ${envPath}\n`);

async function checkBalances(label, wallet) {
  console.log(`--- ${label} (${wallet.address}) ---`);
  try {
    const [tCtcBal, sepEthBal] = await Promise.all([
      cc3Provider.getBalance(wallet.address).catch(() => 0n),
      sepoliaProvider.getBalance(wallet.address).catch(() => 0n),
    ]);
    const tCtc = parseFloat(ethers.formatEther(tCtcBal)).toFixed(4);
    const sepEth = parseFloat(ethers.formatEther(sepEthBal)).toFixed(4);

    console.log(`    Creditcoin CC3 Testnet Balance: ${tCtc} tCTC`);
    console.log(`    Ethereum Sepolia Balance:       ${sepEth} SepoliaETH`);

    const readyForCc3 = tCtcBal > 0n;
    const readyForSepolia = sepEthBal > 0n;

    if (!readyForCc3 || !readyForSepolia) {
      console.log(`    ⚠️  Requires Faucet Funding:`);
      if (!readyForCc3) console.log(`       - Claim tCTC:    https://faucet.creditcoin.org/ (enter ${wallet.address})`);
      if (!readyForSepolia) console.log(`       - Claim SepETH:  https://sepoliafaucet.com/ (enter ${wallet.address})`);
    } else {
      console.log(`    ✅ Funded and ready for on-chain contract transactions!`);
    }
  } catch (err) {
    console.warn(`    Failed to fetch balances: ${err.message}`);
  }
  console.log('');
}

await checkBalances('DEPLOYER WALLET', deployerWallet);
await checkBalances('LENDER WALLET', lenderWallet);
await checkBalances('BORROWER WALLET', borrowerWallet);
