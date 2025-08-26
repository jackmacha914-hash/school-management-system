const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User'); // adjust path if needed

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jackmacha914:2qx8aJknHkkKsYeF@school0.ynnxkzv.mongodb.net/SW?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Connected');

    try {
      const existing = await User.findOne({ email: 'admin@example.com' });
      if (existing) {
        console.log('Admin user already exists');
      } else {
        const admin = new User({
          name: 'Admin',
          email: 'admin@admin.com',
          password: 'admin123!', // make sure it matches your hash logic
          role: 'admin'
        });

        await admin.save();
        console.log('Admin user created!');
      }
    } catch (err) {
      console.error('Error creating admin:', err);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
