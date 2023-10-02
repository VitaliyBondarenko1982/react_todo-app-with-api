import { Todo } from '../types';

const getCompletedTodos = (todos: Todo[]) => {
  return todos.filter(todo => todo.completed);
};

export default getCompletedTodos;
