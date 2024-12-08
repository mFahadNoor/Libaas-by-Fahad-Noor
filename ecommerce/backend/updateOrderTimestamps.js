const mongoose = require('mongoose');
const Order = require('./models/Order');

const updateTimestamps = async () => {
  try {
    await mongoose.connect('your_mongodb_connection_string_here');
    
    // Get all orders without createdAt
    const orders = await Order.find({ createdAt: { $exists: false } });
    console.log(`Found ${orders.length} orders without timestamps`);

    // Update each order
    for (const order of orders) {
      // Use the ObjectId's timestamp as the createdAt date
      const timestamp = order._id.getTimestamp();
      
      await Order.updateOne(
        { _id: order._id },
        { 
          $set: { 
            createdAt: timestamp,
            updatedAt: timestamp
          }
        }
      );
    }

    console.log('Successfully updated timestamps');
    process.exit(0);
  } catch (error) {
    console.error('Error updating timestamps:', error);
    process.exit(1);
  }
};

updateTimestamps(); 