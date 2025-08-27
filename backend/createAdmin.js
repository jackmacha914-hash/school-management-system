// createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user'); // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists:', existingAdmin.email);
      mongoose.connection.close();
      return;
    }

    // Create new admin
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'AdminPass123', // will be auto-hashed by pre-save hook
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created:', admin.email);

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error creating admin:', err);
    mongoose.connection.close();
  });
