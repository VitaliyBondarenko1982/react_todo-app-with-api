import cn from 'classnames';
import useTodosContext from '../../contexts/useTodosContext';
import { FilterStatus, TodosError } from '../../constants';
import { getActiveTodos, getCompletedTodos } from '../../utils';
import { deleteTodo } from '../../api/todos';

const filterLinks = [
  {
    href: '#/',
    dataCy: 'FilterLinkAll',
    status: FilterStatus.ALL,
  },
  {
    href: '#/active',
    dataCy: 'FilterLinkActive',
    status: FilterStatus.ACTIVE,
  },
  {
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
    status: FilterStatus.COMPLETED,
  },
];

const Footer = () => {
  const {
    todos,
    setTodos,
    filter,
    handleFilter,
    handleErrorMessage,
    setTodosInProcess,
  } = useTodosContext();

  const activeTodos = getActiveTodos(todos);
  const completedTodos = getCompletedTodos(todos);

  const removeCompletedTodos = () => {
    const completedTodosIds = getCompletedTodos(todos).map(t => t.id);

    setTodosInProcess(completedTodosIds);

    Promise
      .all(completedTodosIds
        .map(id => deleteTodo(id)))
      .then(() => setTodos(prevTodos => prevTodos
        .filter((todo) => !completedTodosIds.includes(todo.id))))
      .catch(handleErrorMessage(TodosError.DELETE_TODO))
      .finally(() => setTodosInProcess([]));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ href, status, dataCy }) => (
          <a
            href={href}
            className={cn('filter__link', { selected: status === filter })}
            data-cy={dataCy}
            key={href}
            onClick={handleFilter(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={removeCompletedTodos}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
