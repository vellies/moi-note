import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://vellies_leads:WZeAOH8wEuq0eoYq@cluster0.q1gjblz.mongodb.net/moi-note?retryWrites=true&w=majority';
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/make-admin.mjs <email>');
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();

const db = client.db('moi-note');
const result = await db.collection('users').updateOne(
  { email: email.toLowerCase() },
  { $set: { role: 'admin' } }
);

if (result.matchedCount === 0) {
  console.error(`No user found with email: ${email}`);
} else {
  console.log(`✓ ${email} is now admin`);
}

await client.close();
