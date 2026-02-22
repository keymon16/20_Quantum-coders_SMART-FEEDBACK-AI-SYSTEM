const mongoose = require('mongoose');
const fs = require('fs');

// Parse .env.local
const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const i = line.indexOf('=');
    if (i > 0) {
        const key = line.substring(0, i).trim();
        const val = line.substring(i + 1).trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        env[key] = val;
    }
});

const StudentSchema = new mongoose.Schema({ name: String, email: String, teacherId: mongoose.Schema.Types.ObjectId }, { strict: false });
const AssignmentSchema = new mongoose.Schema({ title: String, teacherId: mongoose.Schema.Types.ObjectId, createdAt: Date }, { strict: false });
const FeedbackSchema = new mongoose.Schema({
    assignmentId: mongoose.Schema.Types.ObjectId,
    studentId: mongoose.Schema.Types.ObjectId,
    originalSubmission: String,
    aiInsights: Array,
    draftFeedback: String,
    finalFeedback: String,
    status: String,
    teacherId: mongoose.Schema.Types.ObjectId,
    createdAt: Date,
    acknowledgedAt: { type: Date, default: null }
});

async function main() {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
    const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
    const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

    // Find a student
    let student = await Student.findOne({ email: 'test@example.com' }).lean();
    if (!student) {
        console.log('❌ test@example.com not found. Finding any student...');
        student = await Student.findOne().lean();
    }
    if (!student) {
        console.log('❌ No students found. Please add a student first via /dashboard/roster');
        await mongoose.disconnect();
        return;
    }
    console.log(`✅ Found student: ${student.name} (${student.email})`);

    // Find or create a dummy assignment
    let assignment = await Assignment.findOne({ teacherId: student.teacherId }).lean();
    if (!assignment) {
        assignment = await Assignment.create({
            title: 'Test Assignment',
            teacherId: student.teacherId || new mongoose.Types.ObjectId(),
            createdAt: new Date()
        });
        console.log('✅ Created dummy assignment');
    }

    // Find the teacher from student record
    const teacherId = student.teacherId || assignment.teacherId;

    // Check if approved feedback already exists for this student
    const existing = await Feedback.findOne({ studentId: student._id, status: 'approved' });
    if (existing) {
        console.log(`ℹ️  Approved feedback already exists for ${student.name}`);
        console.log(`   acknowledgedAt: ${existing.acknowledgedAt || 'null'}`);
    } else {
        // Create an approved feedback record
        const fb = await Feedback.create({
            assignmentId: assignment._id,
            studentId: student._id,
            originalSubmission: 'Test submission text for verification purposes.',
            aiInsights: [{ category: 'Test Category', description: 'Test insight', confidenceScore: 85, severity: 'medium' }],
            draftFeedback: `Dear ${student.name},\n\nYou have done an excellent job on this assignment. Your analysis was thorough and well-structured. Keep up the great work!\n\nBest regards,\nYour Teacher`,
            finalFeedback: '',
            status: 'approved',
            teacherId,
            createdAt: new Date(),
            acknowledgedAt: null
        });
        console.log(`✅ Created approved feedback record (ID: ${fb._id}) for ${student.name} (${student.email})`);
    }

    console.log('\n📋 Summary:');
    console.log(`   Student Email: ${student.email}`);
    console.log(`   Go to: http://localhost:3000/student`);
    console.log(`   Enter email: ${student.email}`);
    console.log(`   Click "I've read this" to acknowledge`);
    console.log(`   Then go to: http://localhost:3000/dashboard/feedback`);
    console.log(`   Check for green "✓ Read" badge`);

    await mongoose.disconnect();
}

main().catch(e => console.error('Error:', e.message));
