import { ethers } from "ethers";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const provider = new ethers.JsonRpcProvider(
  "https://testnet.evm.nodes.onflow.org"
);

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

const client = new MongoClient(mongoUri);

// Replace with the contract address and ABI for your Flow EVM contract
const CONTRACT_ADDRESS = "0x8090889f6f694CF0177dc3a71428276A0b9DBd32";
const CONTRACT_ABI = [
  "event CounterIncremented(uint256 newCounterValue)",
  "event reefCreated(uint256 reefId, string reefName, string reefLocation)",
];
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

// Function to listen for events
async function listenForEvents(db: any) {
  console.log("Listening for CounterIncremented events...");

  // Listen for the CounterIncremented event

  try {
    // Listen for reefCreated event
    contract.on(
      "reefCreated",
      async (reefId, reefName, reefLocation, event) => {
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
        console.log("Event details:", event.log.transactionHash);
        await db.collection("reefs").insertOne({
          reefId,
          reefName,
          reefLocation,
          transactionHash: event.log.transactionHash,
          timestamp: new Date(),
        });

        // Save the event to the database
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function connectToDb() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("Aura");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Start the event listener

async function main() {
  const db = await connectToDb();
  await listenForEvents(db);
}

main();
