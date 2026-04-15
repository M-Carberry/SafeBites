require('dotenv').config({ path: 'configA.env' });
const { MongoClient, ServerApiVersion } = require('mongodb');

const connectionString = process.env.MONGO_URI;
if (!connectionString) {
  throw new Error("MongoDB connection string is not defined in configA.env");
}

const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Successfully connected to MongoDB!");
  return client.db(); // returns the database so server.cjs can use it
}

module.exports = { connectToDatabase }; 