import { useContext } from 'react';
import { TodosContext } from './TodosContextProvider';

const useTodosContext = () => useContext(TodosContext);

export default useTodosContext;
