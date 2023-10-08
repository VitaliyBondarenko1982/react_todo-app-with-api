export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TempTodo = Todo | null;

export interface User {
  id: number;
  name: string;
  email: string;
}
