import Modal from 'react-modal';
import '@/app/globals.css';

// Modal.setAppElement('#main');

interface BaseModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  children?: React.ReactNode;
}

export default function BaseModal({ isOpen, onRequestClose, title, children }: BaseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Member Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="modal-content flex flex-col">
        <div className='width-full flex justify-between align-middle'>
          <h1 className="text-xl font-bold text-center text-[#6b5b95]">
            {title}
          </h1>
          <button 
            className="float-right text-[#6b5b95] text-3xl"
            onClick={onRequestClose}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </Modal>
  );
}
