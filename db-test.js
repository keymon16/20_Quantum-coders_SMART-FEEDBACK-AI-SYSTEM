const mongoose = require('mongoose');
const fs = require('fs');

// Manual .env.local parser
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
        env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

const StudentSchema = new mongoose.Schema({
    name: String,
    email: String,
    teacherId: mongoose.Schema.Types.ObjectId
});

const FeedbackSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    status: String,
    teacherId: mongoose.Schema.Types.ObjectId
});

async function checkData() {
    console.log("Connecting to MongoDB...");
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("Connected!");

        const Student = mongoose.model('Student', StudentSchema);
        const Feedback = mongoose.model('Feedback', FeedbackSchema);

        const students = await Student.find({});
        console.log(`Found ${students.length} students:`);
        students.forEach(s => console.log(` - ${s.name}: ${s.email} (ID: ${s._id})`));

        const feedbacks = await Feedback.find({ status: 'approved' }).populate('studentId');
        console.log(`\nFound ${feedbacks.length} approved feedbacks:`);
        feedbacks.forEach(f => {
            const s = f.studentId;
            console.log(` - Feedback ID: ${f._id}`);
            if (s) {
                console.log(`   Linked to: ${s.name} (${s.email})`);
            } else {
                console.log(`   LINK FAILED: studentId is ${f.studentId}`);
            }
        });

    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
