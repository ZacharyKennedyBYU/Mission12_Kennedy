import { Book } from '../types/Book';

const BASE_URL =
  'https://bookproject-kennedy-backend-h7cwevgmdqb4gedu.eastus-01.azurewebsites.net/api/Book';

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
    `${BASE_URL}/AllProjects?pageHowMany=${pageSize}&pageNum=${pageNum}${sortParam}${selectedCategories.length ? `&${categoryParams}` : ''}`,
    {
      credentials: 'include',
      mode: 'cors',
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const getBook = async (bookId: number): Promise<Book> => {
  const response = await fetch(`${BASE_URL}/${bookId}`, {
    credentials: 'include',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const addBook = async (book: Omit<Book, 'bookID'>): Promise<Book> => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
    credentials: 'include',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const updateBook = async (book: Book): Promise<Book> => {
  const response = await fetch(`${BASE_URL}/${book.bookID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
    credentials: 'include',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const deleteBook = async (bookId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${bookId}`, {
    method: 'DELETE',
    credentials: 'include',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
};
