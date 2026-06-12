// Use existing Firebase configuration
require('dotenv').config();
const { db } = require('./src/config/firebase');

// Sample books across different categories
const sampleBooks = [
    // Fiction
    {
        isbn: '9780061120084',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        category: 'Fiction',
        condition: 'Good',
        description: 'A classic novel of a lawyer in the Depression-era South defending a black man charged with rape.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
        status: 'available',
        userUID: 'sample_user_1',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780451524935',
        title: '1984',
        author: 'George Orwell',
        category: 'Fiction',
        condition: 'Excellent',
        description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
        status: 'available',
        userUID: 'sample_user_2',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780316769174',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        category: 'Fiction',
        condition: 'Good',
        description: 'The story of teenage rebellion and alienation.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg',
        status: 'available',
        userUID: 'sample_user_1',
        createdAt: new Date().toISOString()
    },

    // Science Fiction
    {
        isbn: '9780441172719',
        title: 'Dune',
        author: 'Frank Herbert',
        category: 'Science Fiction',
        condition: 'Good',
        description: 'Epic science fiction novel set in the distant future amidst a huge interstellar empire.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
        status: 'available',
        userUID: 'sample_user_3',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780345391803',
        title: 'The Hitchhiker\'s Guide to the Galaxy',
        author: 'Douglas Adams',
        category: 'Science Fiction',
        condition: 'Excellent',
        description: 'A comedic science fiction series following the adventures of Arthur Dent.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg',
        status: 'available',
        userUID: 'sample_user_2',
        createdAt: new Date().toISOString()
    },

    // Fantasy
    {
        isbn: '9780547928227',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        category: 'Fantasy',
        condition: 'Good',
        description: 'A fantasy novel about the quest of home-loving Bilbo Baggins.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
        status: 'available',
        userUID: 'sample_user_1',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780439708180',
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        category: 'Fantasy',
        condition: 'Excellent',
        description: 'The first novel in the Harry Potter series about a young wizard.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
        status: 'available',
        userUID: 'sample_user_3',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780553593716',
        title: 'A Game of Thrones',
        author: 'George R.R. Martin',
        category: 'Fantasy',
        condition: 'Good',
        description: 'First book in A Song of Ice and Fire series, epic fantasy with political intrigue.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780553593716-L.jpg',
        status: 'available',
        userUID: 'sample_user_2',
        createdAt: new Date().toISOString()
    },

    // Mystery/Thriller
    {
        isbn: '9780307588371',
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        category: 'Mystery',
        condition: 'Good',
        description: 'A psychological thriller about a woman who disappears on her wedding anniversary.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg',
        status: 'available',
        userUID: 'sample_user_1',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780307277671',
        title: 'The Girl with the Dragon Tattoo',
        author: 'Stieg Larsson',
        category: 'Mystery',
        condition: 'Excellent',
        description: 'A mystery thriller about a journalist and a hacker investigating a disappearance.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780307277671-L.jpg',
        status: 'available',
        userUID: 'sample_user_3',
        createdAt: new Date().toISOString()
    },

    // Non-Fiction
    {
        isbn: '9780307887894',
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        category: 'Non-Fiction',
        condition: 'Excellent',
        description: 'A narrative history of humanity from the Stone Age to the modern age.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg',
        status: 'available',
        userUID: 'sample_user_2',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9781501124020',
        title: 'Educated',
        author: 'Tara Westover',
        category: 'Non-Fiction',
        condition: 'Good',
        description: 'A memoir about a woman who grows up in a survivalist family and eventually earns a PhD.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9781501124020-L.jpg',
        status: 'available',
        userUID: 'sample_user_1',
        createdAt: new Date().toISOString()
    },

    // Self-Help
    {
        isbn: '9781501110368',
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'Self-Help',
        condition: 'Excellent',
        description: 'A practical guide to building good habits and breaking bad ones.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg',
        status: 'available',
        userUID: 'sample_user_3',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780062316097',
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        category: 'Self-Help',
        condition: 'Good',
        description: 'Explores what it means to be human and how we can find meaning in life.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
        status: 'available',
        userUID: 'sample_user_2',
        createdAt: new Date().toISOString()
    },

    // Biography
    {
        isbn: '9781501127625',
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        category: 'Biography',
        condition: 'Good',
        description: 'The exclusive biography of Steve Jobs, co-founder of Apple.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9781501127625-L.jpg',
        status: 'available',
        userUID: 'sample_user_1',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780143127741',
        title: 'Becoming',
        author: 'Michelle Obama',
        category: 'Biography',
        condition: 'Excellent',
        description: 'Memoir by former First Lady of the United States Michelle Obama.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780143127741-L.jpg',
        status: 'available',
        userUID: 'sample_user_3',
        createdAt: new Date().toISOString()
    },

    // Romance
    {
        isbn: '9780143127550',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        category: 'Romance',
        condition: 'Good',
        description: 'Classic romantic novel about Elizabeth Bennet and Mr. Darcy.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780143127550-L.jpg',
        status: 'available',
        userUID: 'sample_user_2',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9781594631931',
        title: 'The Notebook',
        author: 'Nicholas Sparks',
        category: 'Romance',
        condition: 'Excellent',
        description: 'A love story about a couple who fall in love in the 1940s.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg',
        status: 'available',
        userUID: 'sample_user_1',
        createdAt: new Date().toISOString()
    },

    // Horror
    {
        isbn: '9780307743657',
        title: 'The Shining',
        author: 'Stephen King',
        category: 'Horror',
        condition: 'Good',
        description: 'A horror novel about a family isolated in a haunted hotel.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg',
        status: 'available',
        userUID: 'sample_user_3',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780385121675',
        title: 'It',
        author: 'Stephen King',
        category: 'Horror',
        condition: 'Good',
        description: 'Horror novel about seven children terrorized by an entity that exploits their fears.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780385121675-L.jpg',
        status: 'available',
        userUID: 'sample_user_2',
        createdAt: new Date().toISOString()
    },

    // Technology
    {
        isbn: '9780735611313',
        title: 'Code Complete',
        author: 'Steve McConnell',
        category: 'Technology',
        condition: 'Good',
        description: 'A practical handbook of software construction.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780735611313-L.jpg',
        status: 'available',
        userUID: 'sample_user_1',
        createdAt: new Date().toISOString()
    },
    {
        isbn: '9780134685991',
        title: 'Effective Java',
        author: 'Joshua Bloch',
        category: 'Technology',
        condition: 'Excellent',
        description: 'Best practices for the Java programming language.',
        coverImage: 'https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg',
        status: 'available',
        userUID: 'sample_user_3',
        createdAt: new Date().toISOString()
    }
];

// Function to add books to Firestore
async function addSampleBooks() {
    try {
        console.log('Starting to add sample books...');

        const batch = db.batch();

        sampleBooks.forEach((book) => {
            const docRef = db.collection('books').doc();
            batch.set(docRef, book);
        });

        await batch.commit();

        console.log(`✅ Successfully added ${sampleBooks.length} sample books!`);
        console.log('\nBooks by category:');

        const categories = {};
        sampleBooks.forEach(book => {
            categories[book.category] = (categories[book.category] || 0) + 1;
        });

        Object.entries(categories).forEach(([category, count]) => {
            console.log(`  - ${category}: ${count} books`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding sample books:', error);
        process.exit(1);
    }
}

addSampleBooks();
