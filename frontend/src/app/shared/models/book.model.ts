export interface Book {
    id?: string;
    isbn: string;
    title: string;
    author: string;
    description?: string;
    condition: string;
    coverImage?: string;
    userUID: string;
    ownerEmail?: string;
    status: 'available' | 'swapped' | 'pending';
    genre?: string;
    // Add other fields as discovered
}
