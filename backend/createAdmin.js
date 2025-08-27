const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User'); // adjust if your User.js path differs

dotenv.config();

async function createAdmin() {
  try {
    // connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    // check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
      return process.exit();
    }

    // create new admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("🎉 Admin created successfully:");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123");

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createAdmin();
