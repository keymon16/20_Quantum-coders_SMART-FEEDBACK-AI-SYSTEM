// Script to clean up bad feedback records AND test Groq
const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim().replace(/^"(.*)"$/, '$1');
        env[key] = val;
    }
});

const FeedbackSchema = new mongoose.Schema({
    studentId: mongoose.Schema.Types.Mixed,
    status: String,
    teacherId: mongoose.Schema.Types.ObjectId,
    draftFeedback: String,
    originalSubmission: String,
});

async function run() {
    // 1. Test Groq
    console.log("=== Testing Groq ===");
    const groq = new Groq({ apiKey: env.GROQ_API_KEY });
    try {
        const r = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: "Say: AI is working!" }],
            max_tokens: 20
        });
        console.log("✅ Groq works:", r.choices[0]?.message?.content);
    } catch (e) {
        console.error("❌ Groq Error:", e.message, "Status:", e.status);
        return;
    }

    // 2. Clean bad DB records
    console.log("\n=== Cleaning DB ===");
    await mongoose.connect(env.MONGODB_URI);
    const Feedback = mongoose.model('Feedback', FeedbackSchema);

    // Find and delete feedbacks with non-ObjectId studentIds
    const all = await Feedback.find({}).lean();
    let badCount = 0;
    for (const f of all) {
        if (f.studentId && !mongoose.Types.ObjectId.isValid(f.studentId)) {
            console.log(`Deleting bad feedback (studentId="${f.studentId}")`);
            await Feedback.deleteOne({ _id: f._id });
            badCount++;
        }
    }
    console.log(`Cleaned ${badCount} bad records. ${all.length - badCount} records remain.`);
    await mongoose.disconnect();
}

run().catch(console.error);
