import { Todo, User } from '../types';
import { client } from '../utils';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Omit<Todo, 'id'>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const getUser = (email: string) => {
  return client.get<User[]>(`/users?email=${email}`).then(res => {
    return res[0] || null;
  });
};

export const createUser = (data: Omit<User, 'id'>) => {
  return client.post<User>('/users', data);
};

// Add more methods here
