const fs = require('fs');

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
        env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

async function testOpenAI() {
    console.log("Testing OpenAI API Key...");
    console.log("Key starts with:", env.OPENAI_API_KEY?.substring(0, 15) + "...");

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Say: API key working!" }],
            max_tokens: 10
        });
        console.log("✅ OpenAI API Response:", response.choices[0].message.content);
    } catch (err) {
        console.error("❌ OpenAI API Error:", err.message);
        if (err.status === 401) {
            console.error("→ API Key is INVALID or expired. Please generate a new one at https://platform.openai.com/api-keys");
        } else if (err.status === 429) {
            console.error("→ Rate limit or QUOTA exceeded. Check your billing at https://platform.openai.com/account/billing");
        } else {
            console.error("→ Status:", err.status, "Code:", err.code);
        }
    }
}

testOpenAI();
