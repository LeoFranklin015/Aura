import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://testnet.evm.nodes.onflow.org"
);
const CONTRACT_ADDRESS = "0x8090889f6f694CF0177dc3a71428276A0b9DBd32";
const CONTRACT_ABI = [
  "event CounterIncremented(uint256 newCounterValue)",
  "event reefCreated(uint256 reefId, string reefName, string reefLocation)",
];
export const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  provider
);
