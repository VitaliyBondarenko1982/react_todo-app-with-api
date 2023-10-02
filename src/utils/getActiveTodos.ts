import { Todo } from '../types';

const getActiveTodos = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed);
};

export default getActiveTodos;
