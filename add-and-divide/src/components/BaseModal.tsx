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
        <div className='width-full'>
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
