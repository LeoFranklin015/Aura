import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://testnet.evm.nodes.onflow.org"
);

// Replace with the contract address and ABI for your Flow EVM contract
const CONTRACT_ADDRESS = "0x8090889f6f694CF0177dc3a71428276A0b9DBd32";
const CONTRACT_ABI = [
  "event CounterIncremented(uint256 newCounterValue)",
  "event reefCreated(uint256 reefId, string reefName, string reefLocation)",
];
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

// Function to listen for events
async function listenForEvents() {
  console.log("Listening for CounterIncremented events...");

  // Listen for the CounterIncremented event

  try {
    contract.on("CounterIncremented", (newCounterValue, event) => {
      if (!event || !event.args) {
        console.error("Received an undefined event. Skipping...");
        return;
      }
      if (newCounterValue) {
        console.log(
          "Event detected! Counter incremented to:",
          newCounterValue.toString()
        );
        console.log("Event details:", event);
      }
    });

    // Listen for reefCreated event
    contract.on("reefCreated", (reefId, reefName, reefLocation, event) => {
      if (!event || !event.args) {
        console.error(
          "Received an undefined event for reefCreated. Skipping..."
        );
        return;
      }
      console.log("reefCreated event detected! Reef details:");
      console.log("Reef ID:", reefId.toString());
      console.log("Reef Name:", reefName);
      console.log("Reef Location:", reefLocation);
      console.log("Event details:", event);
    });
  } catch (err) {
    console.log(err);
  }
}

// Start the event listener
listenForEvents();
