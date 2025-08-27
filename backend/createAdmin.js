const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User'); // adjust path if needed

dotenv.config();

async function createAdmin() {
  try {
    // connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    // check if an admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists with email:", existingAdmin.email);
      return process.exit();
    }

    // create hashed password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // create new admin user
    const admin = new User({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("🎉 Admin user created successfully:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);

    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
