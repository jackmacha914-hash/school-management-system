const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Import your User model
const User = require('./models/User'); // make sure path is correct

// Use your Atlas or local URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SW';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Connected');

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin123!', // hash it if your app does
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
