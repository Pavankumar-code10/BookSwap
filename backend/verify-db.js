const { admin, db } = require('./src/config/firebase');

async function verifyData() {
    try {
        console.log('--- USERS ---');
        const usersSnap = await db.collection('users').get();
        if (usersSnap.empty) {
            console.log('No users found!');
        } else {
            usersSnap.forEach(doc => {
                console.log(`User ID: ${doc.id}, Name: ${doc.data().displayName || doc.data().username}, Email: ${doc.data().email}`);
            });
        }

        console.log('\n--- BOOKS ---');
        const booksSnap = await db.collection('books').get();
        if (booksSnap.empty) {
            console.log('No books found!');
        } else {
            booksSnap.forEach(doc => {
                const book = doc.data();
                console.log(`Book ID: ${doc.id}, Title: ${book.title}, OwnerUID: ${book.ownerId || book.ownerUid || book.userId}`);
            });
        }

    } catch (error) {
        console.error('Error verifying data:', error);
    }
}

verifyData();
