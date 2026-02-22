const pdfParse = require('pdf-parse');
console.log("pdfParse type:", typeof pdfParse);
console.log("pdfParse keys:", Object.keys(pdfParse));
if (typeof pdfParse === 'function') {
    console.log("It's a function natively.");
}
