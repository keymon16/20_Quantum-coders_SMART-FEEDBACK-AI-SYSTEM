const Groq = require("groq-sdk");
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

console.log("Groq Key:", env.GROQ_API_KEY ? env.GROQ_API_KEY.substring(0, 10) + '...' : 'NOT FOUND');

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: "Say: Groq is working!" }],
    max_tokens: 20
}).then(r => {
    console.log("✅ Groq API SUCCESS:", r.choices[0]?.message?.content);
}).catch(e => {
    console.error("❌ Groq API Error:", e.message);
});
