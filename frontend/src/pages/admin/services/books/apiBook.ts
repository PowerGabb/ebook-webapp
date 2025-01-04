import { apiCall } from "@/lib/api";

export async function getAllBooks() {
  const response = await apiCall('/book', {
    method: 'GET',
  });
  return response;
}

export async function deleteBook(id: number) {
  const response = await apiCall(`/book/${id}`, {
    method: 'DELETE',
  });
  return response;
}                             

interface CreateBookData {
  title: string;
  author: string;
  description: string;
  categories: string[];
  coverImage: File;
  epubFile: File;
  isbn?: string;
  publisher?: string;
  totalPages?: number;
  isPublished?: boolean;
  publishedAt?: string | null;
}

export async function createBook(bookData: CreateBookData) {
  const formData = new FormData();
  formData.append('title', bookData.title);
  formData.append('author', bookData.author);
  formData.append('categories', JSON.stringify(bookData.categories));
  formData.append('coverImage', bookData.coverImage);
  formData.append('description', bookData.description);
  formData.append('epubFile', bookData.epubFile);
  
  if (bookData.isbn) formData.append('isbn', bookData.isbn);
  if (bookData.publisher) formData.append('publisher', bookData.publisher);
  if (bookData.totalPages !== undefined) formData.append('totalPages', bookData.totalPages.toString());
  if (bookData.isPublished !== undefined) formData.append('isPublished', bookData.isPublished.toString());
  if (bookData.publishedAt) formData.append('publishedAt', bookData.publishedAt);

  const response = await apiCall('/book', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function getBookById(id: string) {
  const response = await apiCall(`/book/${id}`, {
    method: 'GET',
  });
  return response;
}

interface UpdateBookData {
  title: string;
  author: string;
  description: string;
  categories: string[];
  coverImage?: File;
  epubFile?: File;
  isbn?: string;
  publisher?: string;
  totalPages?: number;
  isPublished?: boolean;
  publishedAt?: string | null;
}

export async function updateBook(id: string, bookData: UpdateBookData) {
  const formData = new FormData();
  formData.append('title', bookData.title);
  formData.append('author', bookData.author);
  formData.append('description', bookData.description);
  formData.append('categories', JSON.stringify(bookData.categories));
  
  if (bookData.coverImage) {
    formData.append('coverImage', bookData.coverImage);
  }
  
  if (bookData.epubFile) {
    formData.append('epubFile', bookData.epubFile);
  }

  if (bookData.isbn) formData.append('isbn', bookData.isbn);
  if (bookData.publisher) formData.append('publisher', bookData.publisher);
  if (bookData.totalPages !== undefined) formData.append('totalPages', bookData.totalPages.toString());
  if (bookData.isPublished !== undefined) formData.append('isPublished', bookData.isPublished.toString());
  if (bookData.publishedAt) formData.append('publishedAt', bookData.publishedAt);

  const response = await apiCall(`/book/${id}`, {
    method: 'PUT',
    body: formData,
  });
  return response;
}
