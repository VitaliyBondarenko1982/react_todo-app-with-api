import { Todo } from '../types';
import { FilterStatus } from '../constants';
import getActiveTodos from './getActiveTodos';
import getCompletedTodos from './getCompletedTodos';

const getFilteredTodos = (todos: Todo[], filter: FilterStatus): Todo[] => {
  switch (filter) {
    case FilterStatus.ACTIVE:
      return getActiveTodos(todos);
    case FilterStatus.COMPLETED:
      return getCompletedTodos(todos);
    default:
      return todos;
  }
};

export default getFilteredTodos;
