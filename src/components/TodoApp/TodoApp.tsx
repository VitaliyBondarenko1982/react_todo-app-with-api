import { useEffect } from 'react';
import ErrorNotification from '../ErrorNotification';
import Header from '../Header';
import TodoList from '../TodoList';
import Footer from '../Footer';
import useTodosContext from '../../contexts/useTodosContext';
import { getTodos } from '../../api/todos';
import { TodosError } from '../../constants';

const TodoApp = () => {
  const {
    todos, handleErrorMessage, setTodos, user,
  } = useTodosContext();

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
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

export default TodoApp;
