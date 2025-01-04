import { apiCall } from "@/lib/api";

interface CreateUserData {
  email: string;
  password: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  };
}

export async function getAllUsers() {
    const response = await apiCall('/user', {
      method: 'GET',
    });
    return response;
  }

export async function deleteUser(id: string) {
  const response = await apiCall(`/user/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function getUserById(id: string) {
  const response = await apiCall(`/user/${id}`, {
    method: 'GET',
  });
  return response;
}

export async function updateUser(id: string, userData: any) {
  const response = await apiCall(`/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
  return response;
}

export async function createUser(userData: CreateUserData) {
  try {
    const response = await apiCall('/user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    throw error;
  }
}