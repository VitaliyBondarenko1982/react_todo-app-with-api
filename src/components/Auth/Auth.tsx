import { ChangeEvent, FormEvent, useState } from 'react';
import { createUser, getUser } from '../../api/todos';
import useTodosContext from '../../contexts/useTodosContext';

const Auth = () => {
  const [formInputs, setFormInputs] = useState({
    email: '',
    name: '',
  });
  const [isRegister, setIsRegister] = useState(false);

  const { setUser } = useTodosContext();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setFormInputs(prevFormInputs => ({ ...prevFormInputs, [name]: value }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (isRegister) {
      createUser(formInputs).then(res => {
        setUser(res);
      });

      return;
    }

    getUser(formInputs.email).then(res => {
      return res ? setUser(res) : setIsRegister(true);
    });
  };

  return (
    <form className="box mt-5" onSubmit={onSubmit}>
      <h1 className="title is-3">Log in to open todos</h1>
      <div className="field">
        <label htmlFor="user-email" className="label">Email</label>
        <div className="control has-icons-left">
          <input
            type="email"
            id="user-email"
            className="input"
            name="email"
            placeholder="Enter your email"
            required
            value={formInputs.email}
            onChange={onChange}
            disabled={isRegister}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
        </div>
      </div>
      {isRegister && (
        <div className="field">
          <label htmlFor="user-name" className="label">Your Name</label>
          <div className="control has-icons-left">
            <input
              type="text"
              id="user-name"
              className="input"
              name="name"
              placeholder="Enter your name"
              required
              value={formInputs.name}
              onChange={onChange}
              minLength={4}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope" />
            </span>
          </div>
        </div>
      )}
      <div className="field">
        <button
          type="submit"
          className="button is-primary"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default Auth;
