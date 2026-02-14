import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Badge from '../models/Badge.js';
import connectDB from '../config/db.js';

dotenv.config();

const badges = [
  {
    name: 'Bronze Badge',
    level: 'bronze',
    pointsRequired: 50,
    icon: '🥉',
    color: '#cd7f32',
    description: 'Earned for reaching 50 points',
  },
  {
    name: 'Silver Badge',
    level: 'silver',
    pointsRequired: 100,
    icon: '🥈',
    color: '#c0c0c0',
    description: 'Earned for reaching 100 points',
  },
  {
    name: 'Gold Badge',
    level: 'gold',
    pointsRequired: 200,
    icon: '🥇',
    color: '#ffd700',
    description: 'Earned for reaching 200 points',
  },
  {
    name: 'Platinum Badge',
    level: 'platinum',
    pointsRequired: 500,
    icon: '💎',
    color: '#e5e4e2',
    description: 'Earned for reaching 500 points',
  },
];

const seedBadges = async () => {
  try {
    await connectDB();

    // Clear existing badges
    await Badge.deleteMany();

    // Insert badges
    await Badge.insertMany(badges);

    console.log('✅ Badges seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
    process.exit(1);
  }
};

seedBadges();