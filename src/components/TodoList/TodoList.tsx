import useTodosContext from '../../contexts/useTodosContext';
import TodoItem from '../TodoItem';
import { getFilteredTodos } from '../../utils';
import TempTodo from '../TempTodo';

const TodoList = () => {
  const { todos, filter, tempTodo } = useTodosContext();

  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};

export default TodoList;
