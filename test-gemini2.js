const { GoogleGenerativeAI } = require("@google/generative-ai");
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

console.log("Key:", env.GEMINI_API_KEY ? env.GEMINI_API_KEY.substring(0, 12) + '...' : 'NOT FOUND');

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

model.generateContent("Say hello")
    .then(r => console.log("SUCCESS:", r.response.text()))
    .catch(e => console.error("FULL ERROR:", e.message));
