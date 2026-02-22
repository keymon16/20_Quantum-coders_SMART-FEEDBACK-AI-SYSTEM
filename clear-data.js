// Clear ALL feedback and assignment data from the database
const mongoose = require('mongoose');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
        env[trimmed.substring(0, eqIdx).trim()] = trimmed.substring(eqIdx + 1).trim().replace(/^"(.*)"$/, '$1');
    }
});

const FeedbackSchema = new mongoose.Schema({ teacherId: mongoose.Schema.Types.Mixed }, { strict: false });
const AssignmentSchema = new mongoose.Schema({ teacherId: mongoose.Schema.Types.Mixed }, { strict: false });

async function clearAll() {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to DB");

    const Feedback = mongoose.model('Feedback', FeedbackSchema);
    const Assignment = mongoose.model('Assignment', AssignmentSchema);

    const fbCount = await Feedback.countDocuments();
    const asCount = await Assignment.countDocuments();
    console.log(`Found: ${fbCount} feedbacks, ${asCount} assignments`);

    await Feedback.deleteMany({});
    await Assignment.deleteMany({});
    console.log("✅ All feedback and assignment records cleared!");
    console.log("Students roster is UNTOUCHED.");

    await mongoose.disconnect();
}

clearAll().catch(console.error);
