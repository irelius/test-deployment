// frontend/src/components/SignupFormModal/SignupFormModal.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
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
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required.';
    if (!firstName) newErrors.firstName = 'First name is required.';
    if (!lastName) newErrors.lastName = 'Last name is required.';
    if (!email) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      return dispatch(sessionActions.signup({ username, firstName, lastName, email, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) setErrors(data.errors);
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
      <div className="signup-form-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>X</button>
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
            {errors.username && <p className="error-message">{errors.username}</p>}
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
            {errors.firstName && <p className="error-message">{errors.firstName}</p>}
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
            {errors.lastName && <p className="error-message">{errors.lastName}</p>}
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
            {errors.email && <p className="error-message">{errors.email}</p>}
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
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          <button className="form-button" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;