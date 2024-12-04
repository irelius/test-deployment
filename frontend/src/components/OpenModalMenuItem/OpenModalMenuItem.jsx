import { useModal } from '../../context/Modal';
import styles from './OpenModalMenuItem.module.css';

function OpenModalMenuItem({
  itemText, // text of the menu item that opens the modal
  modalComponent, // component to render inside the modal
  onItemClick, // optional: callback function that will be called once the menu item is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onItemClick) onItemClick();
    setModalContent(modalComponent);
    if (onModalClose) setOnModalClose(onModalClose);
  };

  return (
    <div className={styles.openModalMenuItem} onClick={onClick}>
      {itemText}
    </div>
  );
}

export default OpenModalMenuItem;