import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, "❌ Couldn't connect to database"));
db.once('open', () => {
  console.log('✅ Connected to database');
});

export default db;