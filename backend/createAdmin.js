// createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // for password hashing
const User = require('./models/User'); // adjust path if needed

dotenv.config();

// Use your Atlas connection string here
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jackmacha914:2qx8aJknHkkKsYeF@school0.ynnxkzv.mongodb.net/SW?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ MongoDB Connected');

    try {
      const email = 'admin@admin.com';  // change to your desired admin email
      const existing = await User.findOne({ email });

      if (existing) {
        console.log(`⚠ Admin user with email "${email}" already exists.`);
      } else {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin123!', salt); // change password as needed

        const admin = new User({
          name: 'Admin',
          email,
          password: hashedPassword,
          role: 'admin'
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
      }
    } catch (err) {
      console.error('❌ Error creating admin:', err);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
