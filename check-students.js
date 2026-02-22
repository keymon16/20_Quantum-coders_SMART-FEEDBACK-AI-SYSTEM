const mongoose = require('mongoose');
const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const i = line.indexOf('=');
    if (i > 0) env[line.substring(0, i).trim()] = line.substring(i + 1).trim();
});

const StudentSchema = new mongoose.Schema({ name: String, email: String });
const FeedbackSchema = new mongoose.Schema({ studentId: mongoose.Schema.Types.ObjectId, status: String, draftFeedback: String, acknowledgedAt: Date }, { strict: false });

mongoose.connect(env.MONGODB_URI).then(async () => {
    const Student = mongoose.model('Student', StudentSchema);
    const Feedback = mongoose.model('Feedback', FeedbackSchema);

    const students = await Student.find().lean();
    const feedbacks = await Feedback.find({ status: 'approved' }).lean();

    console.log('=== Students ===');
    students.forEach(s => console.log(`  ${s.name} — ${s.email}`));
    console.log(`\n=== Approved Feedbacks: ${feedbacks.length} ===`);
    feedbacks.forEach(f => console.log(`  studentId: ${f.studentId}, acknowledgedAt: ${f.acknowledgedAt || 'null'}`));

    await mongoose.disconnect();
}).catch(e => console.error(e.message));
