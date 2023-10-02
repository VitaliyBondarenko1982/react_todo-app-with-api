import {
  createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState,
} from 'react';
import { TempTodo, Todo } from '../types';
import { FilterStatus, TodosError } from '../constants';
import { noop } from '../utils';

export interface ITodosContext {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  tempTodo: TempTodo;
  setTempTodo: Dispatch<SetStateAction<TempTodo>>;
  todosInProcess: number[];
  setTodosInProcess: Dispatch<SetStateAction<number[]>>
  filter: FilterStatus;
  handleFilter: (filterStatus: FilterStatus) => VoidFunction;
  errorMessage: TodosError;
  handleErrorMessage: (message: TodosError) => VoidFunction;
}
export const TodosContext = createContext<ITodosContext>({
  todos: [],
  setTodos: noop,
  tempTodo: null,
  setTempTodo: noop,
  todosInProcess: [],
  setTodosInProcess: noop,
  filter: FilterStatus.ALL,
  handleFilter: () => noop,
  errorMessage: TodosError.NONE,
  handleErrorMessage: () => noop,
});

interface Props {
  children: ReactNode;
}

const TodosContextProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<TempTodo>(null);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.ALL);
  const [errorMessage, setErrorMessage] = useState<TodosError>(TodosError.NONE);

  const handleErrorMessage = (message: TodosError) => () => {
    setErrorMessage(message);
  };

  const handleFilter = (filterStatus: FilterStatus) => () => {
    setFilter(filterStatus);
  };

  useEffect(() => {
    let timer = 0;

    if (errorMessage) {
      timer = window.setTimeout(() => {
        setErrorMessage(TodosError.NONE);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      tempTodo,
      setTempTodo,
      todosInProcess,
      setTodosInProcess,
      filter,
      handleFilter,
      errorMessage,
      handleErrorMessage,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export default TodosContextProvider;
