import React from 'react';
import { Auth, TodoApp } from './components';
import useTodosContext from './contexts/useTodosContext';

export const App: React.FC = () => {
  const { user } = useTodosContext();

  return (
    <>
      {user ? <TodoApp /> : <Auth />}
    </>
  );
};
