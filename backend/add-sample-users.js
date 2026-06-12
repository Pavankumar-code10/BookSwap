const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const { db } = require('./src/config/firebase');

async function addSampleUsers() {
    try {
        console.log('Starting to add sample users...');

        const sampleUsers = [
            {
                uid: 'sample_user_1',
                displayName: 'Alice Johnson',
                email: 'alice@example.com',
                photoURL: 'https://i.pravatar.cc/150?u=alice',
                bio: 'Avid reader of fiction and memoirs.',
                location: 'New York, NY',
                createdAt: new Date().toISOString()
            },
            {
                uid: 'sample_user_2',
                displayName: 'Bob Smith',
                email: 'bob@example.com',
                photoURL: 'https://i.pravatar.cc/150?u=bob',
                bio: 'Tech enthusiast and sci-fi lover.',
                location: 'San Francisco, CA',
                createdAt: new Date().toISOString()
            },
            {
                uid: 'sample_user_3',
                displayName: 'Charlie Davis',
                email: 'charlie@example.com',
                photoURL: 'https://i.pravatar.cc/150?u=charlie',
                bio: 'Loves fantasy and graphic novels.',
                location: 'Austin, TX',
                createdAt: new Date().toISOString()
            }
        ];

        const batch = db.batch();

        sampleUsers.forEach((user) => {
            const docRef = db.collection('users').doc(user.uid);
            batch.set(docRef, user);
        });

        await batch.commit();
        console.log('✅ Successfully added 3 sample users!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding sample users:', error);
        process.exit(1);
    }
}

addSampleUsers();
