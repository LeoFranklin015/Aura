export const handleReefCreation = async (
  reefId: number,
  reefName: string,
  reefLocation: string,
  transactionhash: string,
  db: any
): Promise<void> => {
  const reefCreationData = {
    reefId,
    reefName,
    reefLocation,
    transactionhash,
    timestamp: new Date(),
  };

  await db.collection("reefs").insertOne(reefCreationData);
  console.log("reefCreated event saved to database:", reefCreationData);
};
