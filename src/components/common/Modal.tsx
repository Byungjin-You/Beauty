import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal 컴포넌트의 props 인터페이스
 */
interface IModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 모달 내용 */
  children: React.ReactNode;
  /** 배경 클릭 시 닫기 여부 */
  closeOnBackdropClick?: boolean;
}

/**
 * ReactPortal을 사용하는 바비톡 스타일의 모달 컴포넌트
 * 
 * @param props - 모달 컴포넌트 props
 * @returns 모달 컴포넌트
 */
const Modal: React.FC<IModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  closeOnBackdropClick = true 
}) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 배경 클릭 핸들러
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 150,
        padding: '16px'
      }}
    >
      <div
        className="modal-content ReactModal__Content ReactModal__Content--after-open"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute',
          inset: 'auto',
          border: '1px solid rgb(204, 204, 204)',
          background: 'white',
          overflow: 'auto',
          borderRadius: '24px',
          outline: 'currentcolor',
          padding: '0px',
          zIndex: 150,
          justifyContent: 'center',
          animation: 'modalFadeIn 0.2s ease-out'
        }}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );

  // ReactPortal 사용하여 body에 직접 렌더링
  return createPortal(modalContent, document.body);
};

export default Modal; 