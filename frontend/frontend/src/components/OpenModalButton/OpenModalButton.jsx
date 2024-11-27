// frontend/src/components/OpenModalMenuItem/OpenModalMenuItem.jsx

import { useModal } from '../../context/Modal';

function OpenModalMenuItem({
  itemText, // text of the menu item that opens the modal
  modalComponent, // component to render inside the modal
  onItemClick, // optional: callback function that will be called once the menu item is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <li onClick={onClick}>{itemText}</li>
  );
}

export default OpenModalMenuItem;