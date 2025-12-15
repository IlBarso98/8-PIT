import { MongoClient, ServerApiVersion } from 'mongodb';

const username = process.env.MONGO_USER || 'Gianmarco';
const password = process.env.MONGO_PASSWORD;
const explicitUri = process.env.MONGO_URI;

if (!password && !explicitUri) {
  console.error(
    'Set MONGO_PASSWORD (and optionally MONGO_USER) or provide a full connection string via MONGO_URI before running this script.'
  );
  process.exit(1);
}

const uri =
  explicitUri ||
  `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(
    password || ''
  )}@pippo.baywkd0.mongodb.net/?appName=Pippo`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('Unable to reach MongoDB:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
