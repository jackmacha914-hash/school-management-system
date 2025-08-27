const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Configuration
const ADMIN_CONFIG = {
  email: 'admin@admin.com',
  name: 'Admin',
  password: 'Admin123!', // Change this to a secure password
  role: 'admin'
};

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jackmacha914:2qx8aJknHkkKsYeF@school0.ynnxkzv.mongodb.net/SW?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(async () => {
  console.log('✅ MongoDB Connected');
  
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_CONFIG.email });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      console.log('\nTo reset the admin password, delete the existing admin first.');
      process.exit(0);
    }

    // Create new admin
    console.log('Creating new admin user...');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.password, salt);

    // Create admin user
    const admin = new User({
      name: ADMIN_CONFIG.name,
      email: ADMIN_CONFIG.email,
      password: hashedPassword,
      role: ADMIN_CONFIG.role
    });

    // Save to database
    await admin.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('==============================');
    console.log(`Email: ${ADMIN_CONFIG.email}`);
    console.log(`Password: ${ADMIN_CONFIG.password}`);
    console.log('==============================');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('Duplicate key error - Admin with this email already exists');
    }
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
})
.catch(error => {
  console.error('❌ MongoDB connection error:', error.message);
  process.exit(1);
});
