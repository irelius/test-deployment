import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(state => state.session.errors) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required.';
    if (!firstName) newErrors.firstName = 'First name is required.';
    if (!lastName) newErrors.lastName = 'Last name is required.';
    if (!email) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    if (Object.keys(newErrors).length > 0) {
      dispatch(sessionActions.setSessionErrors(newErrors));
      return;
    }

    dispatch(sessionActions.signup({ username, firstName, lastName, email, password }))
      .then(closeModal)
      .catch(() => {}); // Errors are already handled in the action
  };

  return (
    <div className="signup-form-container">
      <h1 className="signup-form-title">Sign Up!</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {Array.isArray(errors.username) && errors.username.map((error, idx) => <p key={idx} className="error-message">{error}</p>)}
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            className="form-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {Array.isArray(errors.firstName) && errors.firstName.map((error, idx) => <p key={idx} className="error-message">{error}</p>)}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            className="form-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {Array.isArray(errors.lastName) && errors.lastName.map((error, idx) => <p key={idx} className="error-message">{error}</p>)}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {Array.isArray(errors.email) && errors.email.map((error, idx) => <p key={idx} className="error-message">{error}</p>)}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {Array.isArray(errors.password) && errors.password.map((error, idx) => <p key={idx} className="error-message">{error}</p>)}
        </div>
        <button className="form-button" type="submit">Sign Up</button>
        {Array.isArray(errors.general) && errors.general.map((error, idx) => <p key={idx} className="error-message">{error}</p>)}
      </form>
    </div>
  );
}

export default SignupFormModal;