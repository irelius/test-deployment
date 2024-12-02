import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(state => state.session.errors) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = [];
    if (!credential) newErrors.push('Username or Email is required.');
    if (!password) newErrors.push('Password is required.');
    if (newErrors.length > 0) {
      dispatch(sessionActions.setSessionErrors(newErrors));
      return;
    }

    dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        console.log('Login successful, closing modal');
        closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) dispatch(sessionActions.setSessionErrors(Object.values(data.errors)));
      });
  };

  const handleDemoLogin = () => {
    dispatch(sessionActions.login({ credential: 'demo@user.com', password: 'password' }))
      .then(() => {
        console.log('Demo login successful, closing modal');
        closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) dispatch(sessionActions.setSessionErrors(Object.values(data.errors)));
      });
  };

  return (
    <div className="login-form-container" onClick={(e) => e.stopPropagation()}>
      <h1 className="login-form-title">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <ul>
          {Array.isArray(errors) && errors.map((error, idx) => <li key={idx} className="error-message">{error}</li>)}
        </ul>
        <div className="form-group">
          <label htmlFor="credential">Username or Email</label>
          <input
            id="credential"
            name="credential"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="form-button" type="submit">Log In</button>
      </form>
      <button className="form-button demo-button" onClick={handleDemoLogin}>Log in as Demo User</button>
    </div>
  );
}

export default LoginFormModal;