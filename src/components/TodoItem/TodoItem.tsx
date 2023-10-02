import {
  ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types';
import useTodosContext from '../../contexts/useTodosContext';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodosError } from '../../constants';

interface Props {
  todo: Todo;
}

const TodoItem: FC<Props> = ({ todo }) => {
  const { title, completed, id } = todo;
  const {
    todosInProcess,
    setTodosInProcess,
    setTodos,
    handleErrorMessage,
  } = useTodosContext();

  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const removeTodo = (todoId: number) => () => {
    setTodosInProcess([todoId]);
    deleteTodo(todoId)
      .then(() => setTodos(
        prevTodos => prevTodos.filter(t => t.id !== todoId),
      ))
      .catch(handleErrorMessage(TodosError.DELETE_TODO))
      .finally(() => setTodosInProcess([]));
  };

  const handleCompleteTodo = () => {
    setTodosInProcess([id]);

    updateTodo(
      id,
      { ...todo, completed: !todo.completed },
    )
      .then(updatedTodo => {
        setTodos(
          prevTodos => prevTodos
            .map(t => (t.id === id ? updatedTodo : t)),
        );
      })
      .catch(handleErrorMessage(TodosError.UPDATE_TODO))
      .finally(() => setTodosInProcess([]));
  };

  const handleDoubleClick = () => setIsEditing(true);

  const handleChangeTitle = () => {
    if (title === newTitle) {
      setIsEditing(false);

      return;
    }

    setTodosInProcess([id]);

    updateTodo(
      id,
      { ...todo, title: newTitle },
    )
      .then(updatedTodo => {
        setTodos(
          prevTodos => prevTodos
            .map(t => (t.id === id ? updatedTodo : t)),
        );
      })
      .catch(handleErrorMessage(TodosError.UPDATE_TODO))
      .finally(() => {
        setTodosInProcess([]);
        setIsEditing(false);
      });
  };

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const onBlur = () => {
    handleChangeTitle();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleChangeTitle();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompleteTodo}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={onChangeTitle}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={removeTodo(id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todosInProcess.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
