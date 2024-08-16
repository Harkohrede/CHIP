// Modal.tsx
import React from 'react';
import './modal.css'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className='modal'>
      <div className='content'>
        <button className='close-btn' onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
