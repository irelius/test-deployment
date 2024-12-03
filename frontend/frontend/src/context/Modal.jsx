import { createContext, useContext, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import modalStyles from './Modal.module.css';

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

  useEffect(() => {
    if (!modalRef.current) {
      const modalDiv = document.createElement('div');
      modalDiv.id = 'modal';
      document.body.appendChild(modalDiv);
      modalRef.current = modalDiv;
    }

    return () => {
      if (modalRef.current) {
        document.body.removeChild(modalRef.current);
        modalRef.current = null;
      }
    };
  }, []);

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
      {modalRef.current && ReactDOM.createPortal(
        <>
          {modalContent && (
            <>
              <div className={modalStyles.modalBackground} onClick={closeModal}></div>
              <div className={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                {modalContent}
              </div>
            </>
          )}
        </>,
        modalRef.current || document.body // Use body as a backup
      )}
    </>
  );
}

export const useModal = () => useContext(ModalContext);