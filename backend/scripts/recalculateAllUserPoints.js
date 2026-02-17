import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import PointsHistory from '../models/PointsHistory.js';

// Load environment variables
dotenv.config();

const recalculateAllUserPoints = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`\n📊 Found ${users.length} users to update\n`);

    let updatedCount = 0;
    let unchangedCount = 0;

    for (const user of users) {
      // Calculate totalPoints from PointsHistory (source of truth)
      const pointsHistory = await PointsHistory.find({ user: user._id });
      const calculatedTotalPoints = pointsHistory.reduce((sum, ph) => sum + ph.points, 0);

      const oldPoints = user.totalPoints;
      
      if (user.totalPoints !== calculatedTotalPoints) {
        user.totalPoints = calculatedTotalPoints;
        await user.save();
        
        console.log(`✅ Updated ${user.name}:`);
        console.log(`   Old: ${oldPoints} points`);
        console.log(`   New: ${calculatedTotalPoints} points`);
        console.log(`   Difference: ${calculatedTotalPoints - oldPoints}\n`);
        
        updatedCount++;
      } else {
        unchangedCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📈 RECALCULATION COMPLETE');
    console.log('='.repeat(50));
    console.log(`✅ Updated: ${updatedCount} users`);
    console.log(`⏭️  Unchanged: ${unchangedCount} users`);
    console.log(`📊 Total: ${users.length} users`);
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

recalculateAllUserPoints();
