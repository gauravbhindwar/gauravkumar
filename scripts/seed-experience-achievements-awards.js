#!/usr/bin/env node

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import models
const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  isCurrentPosition: { type: Boolean, default: false },
  description: { type: String, required: true },
  responsibilities: [{ type: String, trim: true }],
  technologies: [{ type: String, trim: true }],
  companyLogo: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'], default: 'Full-time' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Professional', 'Technical', 'Leadership', 'Community', 'Sports', 'Other'], required: true },
  date: { type: Date, required: true },
  organization: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
  impact: { type: String, default: '' },
  metrics: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const AwardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  awardedBy: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  category: { type: String, enum: ['Academic', 'Professional', 'Technical', 'Leadership', 'Innovation', 'Community Service', 'Competition', 'Recognition', 'Other'], required: true },
  level: { type: String, enum: ['International', 'National', 'Regional', 'State', 'Local', 'Institutional'], default: 'Institutional' },
  image: { type: String, default: '' },
  certificateUrl: { type: String, default: '' },
  link: { type: String, default: '' },
  position: { type: String, default: '' },
  prizeValue: { type: String, default: '' },
  criteria: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
const Award = mongoose.models.Award || mongoose.model('Award', AwardSchema);

// Real experience data based on resume
const experienceData = [
  {
    company: "AGILITYAI Private Limited",
    position: "Software Developer Intern / Full Stack Developer",
    location: "Remote",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-09-01"),
    isCurrentPosition: false,
    description: "Developed 3+ scalable web platforms including Fairly-Settled, Edumaniax, and Invoicely (Billing and Invoicing System). Built comprehensive full-stack solutions with modern technologies and optimized performance.",
    responsibilities: [
      "Developed 3+ scalable web platforms (Fairly-Settled, Edumaniax, Invoicely – Billing and Invoicing System)",
      "Built Invoicely: Full-stack invoicing system using Next.js, Node.js, and MongoDB for business invoice management",
      "Implemented secure authentication, role-based dashboards, and dynamic PDF export functionality",
      "Integrated Razorpay payment gateway and automated email notifications for invoice reminders",
      "Optimized performance by caching API calls and refactoring database queries, reducing latency by 25%",
      "Migrated backend from Python Flask to Node.js microservices, reducing API response time by 40%",
      "Automated deployments using Docker and GCP, cutting manual deployment time by 50%"
    ],
    technologies: [
      "Next.js", "React.js", "Node.js", "Express.js", "MongoDB", "JavaScript",
      "Python", "Flask", "Docker", "GCP", "Razorpay", "JWT", "RESTful APIs",
      "Microservices", "PDF Generation", "Email Automation"
    ],
    companyLogo: "",
    companyWebsite: "",
    employmentType: "Internship",
    order: 1,
    isActive: true
  },
  {
    company: "Software Development Center, Manipal University Jaipur",
    position: "Full Stack Web Developer (MERN)",
    location: "Jaipur, India",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-06-01"),
    isCurrentPosition: false,
    description: "Led development of MentorLink, a comprehensive full-stack mentorship platform serving 500+ users. Implemented secure authentication systems and optimized database performance.",
    responsibilities: [
      "Led development of MentorLink, a full-stack mentorship platform (MERN+Next.js) serving 500+ users",
      "Implemented secure RESTful APIs with JWT authentication and multi-role access control",
      "Developed role-based access control using NextAuth and JWT for secure authentication and authorization", 
      "Created modules for assignments, email notifications, archiving, and analytics dashboards with real-time updates",
      "Optimized database queries and reduced load time by 35% through schema refactoring and indexing",
      "Designed and deployed platform architecture supporting university-wide mentorship programs"
    ],
    technologies: [
      "Next.js", "React.js", "Node.js", "Express.js", "MongoDB", "Prisma ORM",
      "NextAuth.js", "JWT", "Tailwind CSS", "RESTful APIs", "Real-time Updates",
      "Database Optimization", "Authentication Systems"
    ],
    companyLogo: "",
    companyWebsite: "",
    employmentType: "Full-time",
    order: 2,
    isActive: true
  }
];

// Real achievements data based on resume/skills
const achievementData = [
  {
    title: "2nd Rank in International Project Expo – MentorLink",
    description: "Achieved 2nd place in the International Project Expo at Manipal University Jaipur for developing MentorLink, a comprehensive mentorship platform. The project was recognized for its innovative approach to university mentorship programs and technical excellence.",
    category: "Academic",
    date: new Date("2025-01-01"),
    organization: "Manipal University Jaipur",
    image: "",
    link: "https://mentorlink-nu.vercel.app",
    tags: ["project-expo", "mentorlink", "international", "award", "innovation"],
    impact: "Recognized for creating a platform serving 500+ users with innovative mentorship solutions",
    metrics: "2nd Place, International Level, 500+ Users Impact",
    order: 1,
    isActive: true,
    isFeatured: true
  },
  {
    title: "Top Performer – AGILITYAI Internship",
    description: "Recognized as Top Performer during internship at AGILITYAI Private Limited for exceptional performance in backend migration and deployment automation. Achieved significant performance improvements and automated deployment processes.",
    category: "Professional",
    date: new Date("2025-09-01"),
    organization: "AGILITYAI Private Limited",
    image: "",
    link: "",
    tags: ["top-performer", "internship", "backend-migration", "automation", "performance"],
    impact: "Successfully migrated backend systems and automated deployments, reducing manual work by 50%",
    metrics: "40% API response time improvement, 50% deployment time reduction",
    order: 2,
    isActive: true,
    isFeatured: true
  },
  {
    title: "Star Performer in SDC – Software Development Center",
    description: "Recognized as Star Performer at Software Development Center (SDC) of Manipal University Jaipur for outstanding contribution to software development projects and technical leadership in full-stack development.",
    category: "Professional",
    date: new Date("2025-06-01"),
    organization: "Software Development Center, Manipal University Jaipur",
    image: "",
    link: "",
    tags: ["star-performer", "sdc", "software-development", "leadership", "full-stack"],
    impact: "Led development of critical university software solutions and mentored junior developers",
    metrics: "Led MentorLink development serving 500+ users, 35% performance optimization",
    order: 3,
    isActive: true,
    isFeatured: true
  },
  {
    title: "MentorLink Platform Development Leadership",
    description: "Successfully led the complete development lifecycle of MentorLink, a full-stack mentorship platform. Implemented advanced features including real-time analytics, secure authentication, and optimized database performance.",
    category: "Technical",
    date: new Date("2025-06-01"),
    organization: "Software Development Center, Manipal University Jaipur",
    image: "",
    link: "https://mentorlink-nu.vercel.app",
    tags: ["mentorlink", "full-stack", "leadership", "mern", "platform-development"],
    impact: "Created comprehensive mentorship solution serving 500+ university students",
    metrics: "500+ active users, 35% load time reduction, real-time features",
    order: 4,
    isActive: true,
    isFeatured: false
  },
  {
    title: "Multi-Platform Development Expertise",
    description: "Successfully developed 3+ scalable web platforms during AGILITYAI internship including Fairly-Settled, Edumaniax, and Invoicely. Demonstrated expertise in full-stack development and system optimization.",
    category: "Technical",
    date: new Date("2025-09-01"),
    organization: "AGILITYAI Private Limited",
    image: "",
    link: "",
    tags: ["multi-platform", "scalable", "invoicely", "full-stack", "optimization"],
    impact: "Delivered multiple production-ready platforms with advanced features and integrations",
    metrics: "3+ platforms developed, 25% latency reduction, payment gateway integration",
    order: 5,
    isActive: true,
    isFeatured: false
  }
];

// Real awards/recognitions data
const awardData = [
  {
    title: "Full Stack Web Developer Certificate",
    description: "Successfully completed comprehensive Full Stack Web Development course covering modern technologies including MERN stack, authentication systems, and deployment strategies.",
    awardedBy: "Udemy",
    date: new Date("2024-01-01"),
    category: "Professional",
    level: "Institutional",
    image: "",
    certificateUrl: "",
    link: "",
    position: "Certified",
    prizeValue: "Professional Certificate",
    criteria: "Completed comprehensive full-stack development curriculum with hands-on projects",
    tags: ["full-stack", "certificate", "udemy", "web-development"],
    order: 1,
    isActive: true,
    isFeatured: true
  },
  {
    title: "Next.js Development Certificate",
    description: "Achieved certification in Next.js development, demonstrating expertise in modern React framework, server-side rendering, and full-stack application development.",
    awardedBy: "Meta Brains",
    date: new Date("2024-03-01"),
    category: "Technical",
    level: "Institutional",
    image: "",
    certificateUrl: "",
    link: "",
    position: "Certified",
    prizeValue: "Technical Certificate",
    criteria: "Demonstrated proficiency in Next.js framework and modern web development practices",
    tags: ["next.js", "react", "meta-brains", "certification"],
    order: 2,
    isActive: true,
    isFeatured: true
  },
  {
    title: "DSA in C/C++ Certificate",
    description: "Completed comprehensive Data Structures and Algorithms course in C/C++, covering essential computer science fundamentals and problem-solving techniques.",
    awardedBy: "Udemy",
    date: new Date("2023-08-01"),
    category: "Technical",
    level: "Institutional",
    image: "",
    certificateUrl: "",
    link: "",
    position: "Certified",
    prizeValue: "Technical Certificate",
    criteria: "Mastered data structures, algorithms, and competitive programming concepts in C/C++",
    tags: ["dsa", "algorithms", "c++", "udemy", "programming"],
    order: 3,
    isActive: true,
    isFeatured: true
  },
  {
    title: "CCNA Enterprise Networking & Security Badge",
    description: "Earned Cisco Certified Network Associate badge for Enterprise Networking and Security, demonstrating knowledge of network fundamentals and security principles.",
    awardedBy: "Cisco",
    date: new Date("2024-05-01"),
    category: "Technical",
    level: "National",
    image: "",
    certificateUrl: "",
    link: "",
    position: "Badge Holder",
    prizeValue: "Professional Badge",
    criteria: "Demonstrated competency in enterprise networking concepts and security practices",
    tags: ["ccna", "networking", "security", "cisco", "badge"],
    order: 4,
    isActive: true,
    isFeatured: false
  },
  {
    title: "Introduction to AI Badge",
    description: "Completed Introduction to Artificial Intelligence course, gaining foundational knowledge in AI concepts, machine learning, and modern AI applications.",
    awardedBy: "IBM SkillsBuild",
    date: new Date("2024-07-01"),
    category: "Technical",
    level: "Institutional",
    image: "",
    certificateUrl: "",
    link: "",
    position: "Badge Holder",
    prizeValue: "Professional Badge",
    criteria: "Demonstrated understanding of AI fundamentals and practical applications",
    tags: ["ai", "artificial-intelligence", "ibm", "skillsbuild", "badge"],
    order: 5,
    isActive: true,
    isFeatured: false
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Experience.deleteMany({});
    await Achievement.deleteMany({});
    await Award.deleteMany({});

    // Seed experiences
    console.log('📊 Seeding experiences...');
    const experiences = await Experience.insertMany(experienceData);
    console.log(`✅ Created ${experiences.length} experiences`);

    // Seed achievements
    console.log('🏆 Seeding achievements...');
    const achievements = await Achievement.insertMany(achievementData);
    console.log(`✅ Created ${achievements.length} achievements`);

    // Seed awards
    console.log('🥇 Seeding awards...');
    const awards = await Award.insertMany(awardData);
    console.log(`✅ Created ${awards.length} awards`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • ${experiences.length} experiences added`);
    console.log(`   • ${achievements.length} achievements added`);
    console.log(`   • ${awards.length} awards added`);
    console.log('\n🔗 You can now view your portfolio at: http://localhost:3000');
    console.log('🔧 Manage content at: http://localhost:3000/admin/dashboard');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;