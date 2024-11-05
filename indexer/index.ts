import { connectToDb } from "./db/dbClient";
import { contract } from "./contract/contract";
import { handleReefCreation } from "./db/eventHandlers/reefCreationHandler";

// Function to listen for events
async function listenForEvents(db: any) {
  console.log("Listening for CounterIncremented events...");

  try {
    // Listen for reefCreated event
    contract.on(
      "reefCreated",
      async (reefId, reefName, reefLocation, event) => {
        if (reefId && reefName && reefLocation && event) {
          await handleReefCreation(
            reefId,
            reefName,
            reefLocation,
            event.log.transactionHash,
            db
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

// Start the event listener

async function main() {
  const db = await connectToDb();
  await listenForEvents(db);
}

main();
