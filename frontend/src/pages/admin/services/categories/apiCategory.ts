import { apiCall } from '../../../../lib/api';

interface CreateCategoryData {
  name: string;
  description: string;
}

export async function getAllCategories() {
  const response = await apiCall('/category', {
    method: 'GET',
  });
  return response;
}

export async function createCategory(categoryData: CreateCategoryData) {
  try {
    const response = await apiCall('/category', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response;
  } catch (error) {
    throw error;
  }
} 

export async function deleteCategory(id: string) {
  const response = await apiCall(`/category/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function getCategoryById(id: string) {
  const response = await apiCall(`/category/${id}`, {
    method: 'GET',
  });
  return response;
}

export async function updateCategory(id: string, categoryData: CreateCategoryData) {
  try {
    const response = await apiCall(`/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return response;
  } catch (error) {
    throw error;
  }
}
