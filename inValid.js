import { MongoClient } from 'mongodb';

async function fixInvalidData() {
  const uri = "mongodb+srv://abhay:Abhay681977@cluster0.u9adwgr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('your_database');
    const collection = db.collection('your_collection');

    // Find documents where totalAmount is a string
    const invalidDocs = await collection.find({ totalAmount: { $type: "string" } }).toArray();
    console.log('Invalid Docs:', invalidDocs);

    // Fix invalid data
    await collection.updateMany(
      { totalAmount: { $type: "string" } },
      { $set: { totalAmount: 0 } }  // Adjust the fix as needed
    );

  } finally {
    await client.close();
  }
}

fixInvalidData().catch(console.error);
