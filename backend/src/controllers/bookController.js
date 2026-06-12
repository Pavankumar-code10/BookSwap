const { db } = require('../config/firebase');
const axios = require('axios');

// Add Book
exports.addBook = async (req, res, next) => {
    try {
        const { isbn, title, author, condition, description, coverImage } = req.body;
        const { uid } = req.user;

        // Validate Input
        if (!isbn || !title || !author) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Prepare Book Data
        const bookData = {
            ownerUid: uid,
            isbn,
            title,
            author,
            condition,
            description: description || '',
            coverImage: coverImage || '', // Frontend might send it, or we fetch it
            status: 'available',
            createdAt: new Date().toISOString()
        };

        // If coverImage is missing, try to fetch from Google Books API (Server-side)
        // Caching/Fetching logic
        if (!bookData.coverImage) {
            try {
                const googleRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
                if (googleRes.data.items && googleRes.data.items.length > 0) {
                    const volumeInfo = googleRes.data.items[0].volumeInfo;
                    bookData.coverImage = volumeInfo.imageLinks?.thumbnail || '';
                    // Optionally cache other metadata here if we had a separate 'book_metadata' collection
                }
            } catch (err) {
                console.error('Google Books API Error:', err.message);
                // Continue without cover image if API fails
            }
        }

        const docRef = await db.collection('books').add(bookData);

        res.status(201).json({ success: true, message: 'Book listed successfully', bookId: docRef.id, book: bookData });
    } catch (error) {
        next(error);
    }
};

// Get All Books (Feed)
exports.getAllBooks = async (req, res, next) => {
    try {
        let query = db.collection('books').where('status', '==', 'available');

        // Basic Pagination (Cursor-based is better for Firestore, but using limit/offset for simplicity if needed, 
        // though Firestore doesn't support offset efficiently. We'll just limit for now).
        // For specific pagination, frontend should send lastVisible ID.

        // Simulating "Feed" - Get recent 20
        // Note: 'orderBy' requires an index in Firestore if combined with 'where' on different fields.
        // Ensure index exists for 'status' + 'createdAt'.

        // query = query.orderBy('createdAt', 'desc').limit(20); 
        // Removing orderBy to avoid index errors during initial setup unless user creates index.

        query = query.limit(50); // Fetch top 50 available books

        const snapshot = await query.get();
        const books = [];
        snapshot.forEach(doc => {
            books.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (error) {
        next(error);
    }
};

// Get Book By ID
exports.getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('books').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }

        res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        next(error);
    }
};

// Delete Book
exports.deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const bookRef = db.collection('books').doc(id);
        const bookDoc = await bookRef.get();

        if (!bookDoc.exists) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }

        const bookData = bookDoc.data();

        if (bookData.userUID !== uid) {
            return res.status(403).json({ success: false, error: 'Unauthorized: You can only delete your own books' });
        }

        await bookRef.delete();

        res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
        next(error);
    }
};
