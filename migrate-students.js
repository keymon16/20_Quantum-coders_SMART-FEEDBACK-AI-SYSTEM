const mongoose = require('mongoose');

// This script migrates existing Student documents from `teacherId` to `teacherIds`
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        const collection = db.collection('students');
        const feedbackCollection = db.collection('feedbacks');

        // Drop existing indexes to remove the old compound index ({ email: 1, teacherId: 1 })
        await collection.dropIndexes();
        console.log('Dropped all indexes on students collection');

        // Find all students (including ones we partially migrated last time which have teacherIds instead of teacherId)
        const cursor = collection.find({});
        const studentsRaw = await cursor.toArray();

        console.log(`Found ${studentsRaw.length} total students.`);

        // Group by email
        const byEmail = {};
        for (const s of studentsRaw) {
            const e = (s.email || "").toLowerCase().trim();
            if (!byEmail[e]) byEmail[e] = [];
            byEmail[e].push(s);
        }

        for (const [email, docs] of Object.entries(byEmail)) {
            // Keep the first document
            const primary = docs[0];

            // Gather all teacherIds and teacherId from all docs in this group
            let allTeacherIds = [];
            for (const d of docs) {
                if (d.teacherId) allTeacherIds.push(d.teacherId.toString());
                if (d.teacherIds) allTeacherIds.push(...d.teacherIds.map(id => id.toString()));
            }

            // Remove duplicates
            const uniqueTeacherIds = [...new Set(allTeacherIds)].map(id => new mongoose.Types.ObjectId(id));

            // Update primary doc
            await collection.updateOne(
                { _id: primary._id },
                {
                    $set: { teacherIds: uniqueTeacherIds },
                    $unset: { teacherId: "" }
                }
            );

            // Delete the others and update their feedbacks
            for (let i = 1; i < docs.length; i++) {
                const dupId = docs[i]._id;

                // Update feedback references
                await feedbackCollection.updateMany(
                    { studentId: dupId },
                    { $set: { studentId: primary._id } }
                );

                // Delete duplicate
                await collection.deleteOne({ _id: dupId });
            }
        }

        console.log('Migration complete. Checking for duplicates before recreating unique index...');

        await collection.createIndex({ email: 1 }, { unique: true });
        console.log('Created unique index on email.');

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
