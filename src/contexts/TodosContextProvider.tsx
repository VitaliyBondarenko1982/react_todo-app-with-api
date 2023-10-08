import {
  createContext, Dispatch, FC, ReactNode, SetStateAction, useState,
} from 'react';
import { TempTodo, Todo, User } from '../types';
import { FilterStatus, TodosError } from '../constants';
import { noop } from '../utils';
import {
  addTodo, deleteTodo, updateTodo,
} from '../api/todos';
import { useLocalStorage } from '../hooks';

export interface ITodosContext {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  tempTodo: TempTodo;
  todosInProcess: number[];
  filter: FilterStatus;
  handleFilter: (filterStatus: FilterStatus) => VoidFunction;
  errorMessage: TodosError;
  handleErrorMessage: (message: TodosError) => VoidFunction;
  handleAddTodo: (
    query: string,
    setQuery: Dispatch<SetStateAction<string>>
  ) => void;
  handleDeleteTodo: (
    todoId: number,
    updateState?: VoidFunction
  ) => VoidFunction;
  handleUpdateTodo: (todo: Todo, updateState?: VoidFunction) => VoidFunction;
}
export const TodosContext = createContext<ITodosContext>({
  todos: [],
  setTodos: noop,
  tempTodo: null,
  user: null,
  setUser: noop,
  todosInProcess: [],
  filter: FilterStatus.ALL,
  errorMessage: TodosError.NONE,
  handleErrorMessage: () => noop,
  handleFilter: () => noop,
  handleAddTodo: noop,
  handleDeleteTodo: () => noop,
  handleUpdateTodo: () => noop,
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
  const [user, setUser] = useLocalStorage<User | null>('user', null);

  const handleErrorMessage = (message: TodosError) => () => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(TodosError.NONE);
    }, 3000);
  };

  const handleFilter = (filterStatus: FilterStatus) => () => {
    setFilter(filterStatus);
  };

  const handleDeleteTodo = (
    todoId: number, updateState?: VoidFunction,
  ) => () => {
    setTodosInProcess(prevTodosInProcess => [...prevTodosInProcess, todoId]);
    deleteTodo(todoId)
      .then(() => setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId)))
      .catch(handleErrorMessage(TodosError.DELETE_TODO))
      .finally(() => {
        setTodosInProcess(prevIds => prevIds
          .filter(processId => processId !== todoId));
        updateState?.();
      });
  };

  const handleUpdateTodo = (
    todo: Todo,
    updateState?: (title?: string) => void,
  ) => () => {
    const { id, ...restTodo } = todo;

    setTodosInProcess(prevTodosInProcess => [...prevTodosInProcess, id]);

    updateTodo(
      id, restTodo,
    )
      .then(updatedTodo => {
        setTodos(
          prevTodos => prevTodos.map(t => (t.id === id ? updatedTodo : t)),
        );
        updateState?.(updatedTodo.title);
      })
      .catch(() => {
        handleErrorMessage(TodosError.UPDATE_TODO);
      })
      .finally(() => {
        setTodosInProcess(prevIds => prevIds
          .filter(processId => processId !== id));
      });
  };

  const handleAddTodo = (
    query: string,
    setQuery: Dispatch<SetStateAction<string>>,
  ) => {
    if (!user) {
      return;
    }

    if (!query.trim()) {
      handleErrorMessage(TodosError.EMPTY_TITLE)();

      return;
    }

    setTempTodo({
      id: 0,
      userId: user.id,
      completed: false,
      title: query.trim(),
    });

    addTodo(query.trim(), user.id)
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setQuery('');
      })
      .catch((handleErrorMessage(TodosError.ADD_TODO)))
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      user,
      setUser,
      tempTodo,
      todosInProcess,
      filter,
      handleFilter,
      errorMessage,
      handleErrorMessage,
      handleAddTodo,
      handleDeleteTodo,
      handleUpdateTodo,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export default TodosContextProvider;
