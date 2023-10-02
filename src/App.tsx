import React, { useEffect } from 'react';
import { ErrorNotification, Header, TodoList } from './components';
import Footer from './components/Footer';
import { TodosError } from './constants';
import { getTodos } from './api/todos';
import useTodosContext from './contexts/useTodosContext';

export const App: React.FC = () => {
  const { todos, handleErrorMessage, setTodos } = useTodosContext();

  useEffect(() => {
    getTodos()
      .then(loadedTodos => setTodos(loadedTodos))
      .catch(handleErrorMessage(TodosError.LOAD_TODOS));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />
        <TodoList />
        {!!todos.length && <Footer />}
      </div>
      <ErrorNotification />
    </div>
  );
};
