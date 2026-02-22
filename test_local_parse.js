const fs = require('fs');
const pdfParse = require('pdf-parse');

async function testLocal() {
    console.log("Reading test PDF...");
    const buffer = fs.readFileSync('test_assignment_upload.pdf');
    console.log("Buffer size:", buffer.length);
    try {
        const data = await pdfParse(buffer);
        console.log("Successfully parsed!");
        console.log("Text length:", data.text.length);
        console.log("Text snippet:", data.text.substring(0, 100));
    } catch (err) {
        console.error("Local parse failed:", err);
    }
}
testLocal();
