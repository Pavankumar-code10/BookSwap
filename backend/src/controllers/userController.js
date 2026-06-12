const { db } = require('../config/firebase');

// Get User Profile
exports.getUserProfile = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            // Auto-create a default profile if missing (Self-healing)
            const defaultUser = {
                userUID: uid,
                displayName: 'Fellow Reader',
                email: '',
                photoURL: 'assets/default-avatar.png',
                bio: 'This user loves reading!',
                createdAt: new Date().toISOString()
            };
            await db.collection('users').doc(uid).set(defaultUser);
            return res.status(200).json({ success: true, data: defaultUser });
        }

        res.status(200).json({ success: true, data: userDoc.data() });
    } catch (error) {
        next(error);
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res, next) => {
    try {
        const { uid } = req.user; // From Auth Middleware
        const updates = req.body;

        // Prevent updating critical fields like uid or email if restricted
        delete updates.userUID;
        delete updates.userEmail;

        await db.collection('users').doc(uid).update(updates);

        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Get User's Books
exports.getUserBooks = async (req, res, next) => {
    try {
        const { uid } = req.params;

        // Query 'books' collection where ownerUid == uid
        const booksSnapshot = await db.collection('books')
            .where('ownerUid', '==', uid)
            .get();

        const books = [];
        booksSnapshot.forEach(doc => {
            books.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (error) {
        next(error);
    }
};
