import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Education Schema
const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  field: { type: String, required: false, trim: true },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  isCurrentlyStudying: { type: Boolean, default: false },
  grade: { type: String, required: false, trim: true },
  gradeType: { type: String, enum: ['GPA', 'Percentage', 'Grade', 'Other'], required: false },
  location: { type: String, required: false, trim: true },
  description: { type: String, required: false },
  coursework: [{ type: String, trim: true }],
  achievements: [{ type: String, trim: true }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Education = mongoose.models.Education || mongoose.model('Education', EducationSchema);

// Education data from resume
const educationData = [
  {
    institution: "Manipal University Jaipur",
    degree: "B.Tech",
    field: "Computer Science and Engineering",
    startDate: new Date("2022-08-01"),
    endDate: new Date("2026-06-01"),
    isCurrentlyStudying: true,
    grade: "7.91",
    gradeType: "GPA",
    location: "Jaipur, India",
    description: "Pursuing Bachelor of Technology in Computer Science and Engineering with focus on software development, algorithms, and modern technologies.",
    coursework: [
      "Data Structures and Algorithms",
      "Object-Oriented Programming",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Software Engineering",
      "Web Development",
      "Machine Learning"
    ],
    achievements: [
      "2nd Rank in International Project Expo for MentorLink",
      "Star Performer in Software Development Center (SDC)",
      "Led development of MentorLink platform serving 500+ users",
      "GPA: 7.91/10"
    ],
    order: 1,
    isActive: true
  },
  {
    institution: "Govt. +2 High School, Supaul",
    degree: "Intermediate",
    field: "PCM (Physics, Chemistry, Mathematics)",
    startDate: new Date("2019-04-01"),
    endDate: new Date("2021-04-01"),
    isCurrentlyStudying: false,
    grade: "75.4%",
    gradeType: "Percentage",
    location: "Supaul, India",
    description: "Completed Higher Secondary Education with Physics, Chemistry, and Mathematics as core subjects.",
    coursework: [
      "Physics",
      "Chemistry", 
      "Mathematics",
      "English",
      "Computer Science"
    ],
    achievements: [
      "75.4% in Board Examinations",
      "Strong foundation in Mathematics and Science"
    ],
    order: 2,
    isActive: true
  },
  {
    institution: "Sanskar Bharti Global School, Bihar",
    degree: "10th Grade",
    field: "Secondary Education",
    startDate: new Date("2018-04-01"),
    endDate: new Date("2019-05-01"),
    isCurrentlyStudying: false,
    grade: "89.90%",
    gradeType: "Percentage",
    location: "Bihar, India",
    description: "Completed Secondary Education with excellent academic performance.",
    coursework: [
      "Mathematics",
      "Science",
      "Social Science",
      "English",
      "Hindi",
      "Computer Applications"
    ],
    achievements: [
      "89.90% in Board Examinations",
      "Excellent academic performance",
      "Strong foundation in core subjects"
    ],
    order: 3,
    isActive: true
  }
];

// Seeding function
const seedEducation = async () => {
  try {
    await connectDB();
    
    // Clear existing education data
    console.log('🗑️  Clearing existing education data...');
    await Education.deleteMany({});
    
    // Seed education data
    console.log('🎓 Seeding education...');
    const createdEducation = await Education.insertMany(educationData);
    console.log(`✅ Created ${createdEducation.length} education entries`);
    
    console.log('\n🎉 Education seeding completed successfully!');
    console.log(`\n📋 Summary:`);
    console.log(`   • ${createdEducation.length} education entries added`);
    console.log(`\n🔗 You can now view your portfolio at: http://localhost:3000`);
    console.log(`🔧 Manage content at: http://localhost:3000/admin/education`);
    
  } catch (error) {
    console.error('❌ Error seeding education:', error);
  } finally {
    console.log('👋 Disconnected from MongoDB');
    await mongoose.disconnect();
  }
};

// Run seeding
seedEducation();