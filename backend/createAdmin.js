

require('dotenv').config(); 
const mongoose = require('mongoose');
const AdminUser = require('./models/AdminUser'); 

const run = async () => {
  
  const adminUsername = 'Romsha@10'; 
  const adminPassword = 'Bulbul@2002%$Cafe^&Kagaaz'; 

  if (adminUsername === 'Romsha@10' || adminPassword === 'Bulbul@2002%$Cafe^&Kagaaz') {
    console.error('\nERROR: Please change the adminUsername and adminPassword variables in createAdmin.js to your desired credentials.\n');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for admin creation.');

    const existingAdmin = await AdminUser.findOne({ username: adminUsername });

    if (existingAdmin) {
      console.log(`Admin user '${adminUsername}' already exists. No new user created.`);
    } else {
      const newAdmin = new AdminUser({
        username: adminUsername,
        password: adminPassword, 
      });
      await newAdmin.save();
      console.log(`Admin user '${adminUsername}' created successfully!`);
    }

    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  }
};

run();
