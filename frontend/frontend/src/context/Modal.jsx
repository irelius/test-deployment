// frontend/src/context/Modal.jsx

import { useRef, useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null);
    if (typeof onModalClose === 'function') {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef,
    modalContent,
    setModalContent,
    setOnModalClose, 
    closeModal,
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} id="modal" />
      {modalRef.current && ReactDOM.createPortal(
        modalContent && (
          <div id="modal-background" onClick={closeModal}>
            <div id="modal-content" onClick={(e) => e.stopPropagation()}>
              {modalContent}
            </div>
          </div>
        ),
        modalRef.current
      )}
    </>
  );
}

export const useModal = () => useContext(ModalContext);