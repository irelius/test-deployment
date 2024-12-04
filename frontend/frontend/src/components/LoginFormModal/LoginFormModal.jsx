import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import loginFormStyles from './LoginFormModal.module.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(state => state.session.errors) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) dispatch(sessionActions.setSessionErrors(Object.values(data.errors)));
      });
  };

  const handleDemoLogin = () => {
    dispatch(sessionActions.login({ credential: 'demo@user.com', password: 'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) dispatch(sessionActions.setSessionErrors(Object.values(data.errors)));
      });
  };

  return (
    <>
      <div className={loginFormStyles.loginOverlay} onClick={closeModal}></div>
      <div className={loginFormStyles.loginFormContainer} onClick={(e) => e.stopPropagation()}>
        <h1 className={loginFormStyles.loginFormTitle}>Log In</h1>
        <form className={loginFormStyles.loginForm} onSubmit={handleSubmit}>
          <ul>
            {Array.isArray(errors) && errors.map((error, idx) => <li key={idx} className={loginFormStyles.errorMessage}>{error}</li>)}
          </ul>
          <div className={loginFormStyles.formGroup}>
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
          <div className={loginFormStyles.formGroup}>
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
          <button type="submit" className={loginFormStyles.formButton}>Log In</button>
          <button type="button" className={loginFormStyles.demoButton} onClick={handleDemoLogin}>Demo User</button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;