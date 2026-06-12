const { db } = require('./src/config/firebase');

async function fixBookOwners() {
    try {
        console.log('Fixing book owner fields...');
        const booksSnap = await db.collection('books').get();
        const batch = db.batch();
        let count = 0;

        booksSnap.forEach(doc => {
            const data = doc.data();
            // If userUID exists but ownerUid does not, migrate it
            if (data.userUID && !data.ownerUid) {
                const docRef = db.collection('books').doc(doc.id);
                batch.update(docRef, { ownerUid: data.userUID });
                count++;
            }
        });

        if (count > 0) {
            await batch.commit();
            console.log(`Updated ${count} books to have 'ownerUid'.`);
        } else {
            console.log('No books needed updating.');
        }

    } catch (error) {
        console.error('Error fixing books:', error);
    }
}

fixBookOwners();
