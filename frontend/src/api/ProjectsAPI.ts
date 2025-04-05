import { Book } from '../types/Book';

interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;
}

export const fetchBooks = async (
    pageSize: number,
    pageNum: number,
    selectedCategories: string[] = [],
    isSorted: boolean = false,
    sortDirection: 'asc' | 'desc' = 'asc'
): Promise<FetchBooksResponse> => {
    const categoryParams = selectedCategories
        .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
        .join('&');
    
    const sortParam = isSorted
        ? `&sortByTitle=true&sortDirection=${sortDirection}`
        : '';
    
    const response = await fetch(
        `https://localhost:5000/api/Book/AllProjects?pageHowMany=${pageSize}&pageNum=${pageNum}${sortParam}${selectedCategories.length ? `&${categoryParams}` : ''}`
    );

    if (!response.ok) {
        throw new Error(
            `API error: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();
    return data;
};

export const getBook = async (bookId: number): Promise<Book> => {
    const response = await fetch(`https://localhost:5000/api/Book/${bookId}`);
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
};

export const addBook = async (book: Omit<Book, 'bookID'>): Promise<Book> => {
    const response = await fetch('https://localhost:5000/api/Book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
};

export const updateBook = async (book: Book): Promise<Book> => {
    const response = await fetch(`https://localhost:5000/api/Book/${book.bookID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
};

export const deleteBook = async (bookId: number): Promise<void> => {
    const response = await fetch(`https://localhost:5000/api/Book/${bookId}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
};