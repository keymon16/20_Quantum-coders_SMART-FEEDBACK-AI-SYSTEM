const mongoose = require('mongoose');
const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').filter(Boolean).forEach(line => {
    const i = line.indexOf('=');
    if (i > 0) {
        let val = line.substring(i + 1).trim();
        val = val.replace(/^\"(.*)\"$/, '$1').replace(/^\'(.*)\'$/, '$1');
        env[line.substring(0, i).trim()] = val;
    }
});

mongoose.connect(env.MONGODB_URI).then(async () => {
    const db = mongoose.connection.db;
    const students = await db.collection('students').find({}).toArray();
    console.log('Total students:', students.length);
    students.forEach(s => console.log('ID:', s._id, '| Name:', s.name, '| Email:', s.email, '| Teacher:', s.teacherId));
    process.exit(0);
}).catch(console.error);
