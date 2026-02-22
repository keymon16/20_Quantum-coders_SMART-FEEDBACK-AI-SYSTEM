const mongoose = require('mongoose');
const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const i = line.indexOf('=');
    if (i > 0) env[line.substring(0, i).trim()] = line.substring(i + 1).trim().replace(/^"(.*)"$/, '$1');
});

mongoose.connect(env.MONGODB_URI)
    .then(() => {
        console.log('✅ DB Status: CONNECTED');
        console.log('   Host:', mongoose.connection.host);
        console.log('   Database:', mongoose.connection.name);
        console.log('   ReadyState:', mongoose.connection.readyState === 1 ? 'Ready' : 'Not Ready');
        return mongoose.disconnect();
    })
    .then(() => console.log('✅ Health check passed! DB is fully operational.'))
    .catch(e => console.error('❌ DB Error:', e.message));
