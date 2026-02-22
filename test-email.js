const nodemailer = require('nodemailer');
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

async function testEmail() {
    console.log("Testing SMTP Connection...");
    console.log("User:", env.SMTP_USER);
    console.log("Host:", env.SMTP_HOST);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS
        }
    });

    try {
        await transporter.verify();
        console.log("SMTP Connection SUCCESSFUL!");

        const info = await transporter.sendMail({
            from: env.SMTP_USER,
            to: env.SMTP_USER, // Send to self for test
            subject: "SMTP Test Workcheck",
            text: "SMTP is working correctly."
        });

        console.log("Email Sent Successfully:", info.messageId);
    } catch (err) {
        console.error("SMTP Error Details:", err);
    }
}

testEmail();
