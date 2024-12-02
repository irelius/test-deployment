import { createContext, useContext, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    console.log('Closing modal');
    setModalContent(null);
    if (typeof onModalClose === 'function') {
      setOnModalClose(null);
      onModalClose();
    }
  };

  useEffect(() => {
    console.log('Modal content changed:', modalContent);
  }, [modalContent]);

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

  useEffect(() => {
    console.log('Modal ref:', modalRef.current);
  }, [modalRef]);

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
        modalContent && (
          <div id="modal-background" onClick={closeModal}>
            <div id="modal-content" onClick={(e) => e.stopPropagation()}>
              {modalContent}
            </div>
          </div>
        ),
        modalRef.current || document.body // Use body as a backup
      )}
    </>
  );
}

export const useModal = () => useContext(ModalContext);