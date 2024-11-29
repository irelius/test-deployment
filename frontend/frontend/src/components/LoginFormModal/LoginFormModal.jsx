// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = [];
    if (!credential) newErrors.push('Username or Email is required.');
    if (!password) newErrors.push('Password is required.');
    setErrors(newErrors);

    if (newErrors.length === 0) {
      return dispatch(sessionActions.login({ credential, password }))
        .then(() => {
          closeModal();
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="login-form-container" onClick={(e) => e.stopPropagation()}>
        <h1 className="login-form-title">Log In</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => <li key={idx} className="error-message">{error}</li>)}
          </ul>
          <div className="form-group">
            <label>
              Username or Email
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button className="form-button" type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default LoginFormModal;