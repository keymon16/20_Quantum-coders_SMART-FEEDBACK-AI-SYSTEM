const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
        env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const MODELS = ["gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash-8b", "gemini-2.0-flash-lite"];

async function testModels() {
    console.log("Testing Gemini API Key...");
    for (const modelName of MODELS) {
        try {
            console.log(`\nTrying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say: working!");
            console.log(`✅ ${modelName} works! Response:`, result.response.text().trim());
            break;
        } catch (err) {
            console.error(`❌ ${modelName} failed: ${err.message.substring(0, 100)}`);
        }
    }
}

testModels();
