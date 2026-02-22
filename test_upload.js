const PDFDocument = require('pdfkit');
const fs = require('fs');

async function createPDF() {
    return new Promise((resolve) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream('test_assignment_upload.pdf');
        doc.pipe(stream);
        for (let i = 0; i < 10; i++) {
            doc.text(`Student ${i} Assignment: The quick brown fox jumps over the lazy dog in the quantum realm. The theory of relativity explains physics on a macroscopic scale while quantum mechanics explains microscopic interactions.`, 100, 100 + (i * 50));
        }
        doc.end();
        stream.on('finish', resolve);
    });
}

async function uploadPDF() {
    await createPDF();
    const formData = new FormData();
    const blob = new Blob([fs.readFileSync('test_assignment_upload.pdf')], { type: 'application/pdf' });
    formData.append('files', blob, 'test_assignment_upload.pdf');

    console.log("Uploading file...");
    const res = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
        // no headers needed, fetch sets multipart boundary automatically
    });

    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", JSON.stringify(data, null, 2));
}

uploadPDF().catch(console.error);
