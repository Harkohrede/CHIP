// App.tsx
import React, { useState } from 'react';
import Modal from './Modal';
import Login from './Login';
import Signup from './Signup';
import './Home.css';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const openLoginForm = () => {
    setIsLoginForm(true);
    setIsModalOpen(true);
  };

  const openSignupForm = () => {
    setIsLoginForm(false);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);


  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <h1>CHIP.LY</h1>
        </div>
        <div className="nav">
          <button onClick={openLoginForm} className="login-btn">
            Login
          </button>
          <button onClick={openSignupForm} className="login-btn">
            Sign Up
          </button>
        </div>
      </div>
      <section className="hero">
        <h2>Shorten Your URLs with Ease</h2>
        <p>Create custom URLs, track analytics, and more!</p>
        <button className="cta-btn" onClick={openSignupForm}>
          Get Started
        </button>
      </section>

      <footer className="footer">
        <p>&copy; 2024 CHIP.LY. All rights reserved.</p>
      </footer>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isLoginForm ? (
          <Login onSignupClick={openSignupForm} />
        ) : (
          <Signup onLoginClick={openLoginForm} />
        )}
      </Modal>
    </div>
  );
};

export default App;
