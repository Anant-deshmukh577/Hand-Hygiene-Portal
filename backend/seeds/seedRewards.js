import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reward from '../models/Reward.js';
import connectDB from '../config/db.js';

dotenv.config();

const rewards = [
  {
    title: 'Coffee Voucher',
    description: 'Get a free coffee from the hospital cafeteria',
    icon: '☕',
    pointsRequired: 50,
    category: 'voucher',
    quantity: -1, // unlimited
    isActive: true,
  },
  {
    title: 'Extra Break Time',
    description: '30 minutes extra break time',
    icon: '⏰',
    pointsRequired: 100,
    category: 'time_off',
    quantity: -1,
    isActive: true,
  },
  {
    title: '₹500 Gift Card',
    description: '₹500 gift card for shopping',
    icon: '🎁',
    pointsRequired: 200,
    category: 'gift',
    quantity: 50,
    isActive: true,
  },
  {
    title: 'Reserved Parking',
    description: 'One month reserved parking spot',
    icon: '🅿️',
    pointsRequired: 300,
    category: 'parking',
    quantity: 10,
    isActive: true,
  },
  {
    title: 'Training Course',
    description: 'Free professional development course',
    icon: '📚',
    pointsRequired: 500,
    category: 'training',
    quantity: 20,
    isActive: true,
  },
  {
    title: 'Day Off',
    description: 'One paid day off',
    icon: '🏖️',
    pointsRequired: 750,
    category: 'time_off',
    quantity: 5,
    isActive: true,
  },
  {
    title: 'Lunch Voucher',
    description: 'Free lunch for one week',
    icon: '🍽️',
    pointsRequired: 150,
    category: 'voucher',
    quantity: -1,
    isActive: true,
  },
  {
    title: '₹1000 Gift Card',
    description: '₹1000 gift card for shopping',
    icon: '💳',
    pointsRequired: 400,
    category: 'gift',
    quantity: 25,
    isActive: true,
  },
];

const seedRewards = async () => {
  try {
    await connectDB();

    // Clear existing rewards
    await Reward.deleteMany();

    // Insert rewards
    await Reward.insertMany(rewards);

    console.log('✅ Rewards seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding rewards:', error);
    process.exit(1);
  }
};

seedRewards();