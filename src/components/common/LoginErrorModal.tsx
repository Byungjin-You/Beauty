import React from 'react';
import Modal from './Modal';

/**
 * LoginErrorModal 컴포넌트의 props 인터페이스
 */
interface ILoginErrorModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
}

/**
 * 로그인 실패 시 표시되는 오류 모달 컴포넌트
 * 
 * @param props - LoginErrorModal 컴포넌트 props
 * @returns 로그인 오류 모달 컴포넌트
 */
const LoginErrorModal: React.FC<ILoginErrorModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackdropClick={false}>
      <div className="tablet:w-[420px] w-[320px] tablet:p-[24px] p-[20px] tablet:pt-[32px] pt-[28px] flex-col justify-start items-center tablet:gap-[32px] gap-[20px] flex">
        <div className="self-stretch flex-col justify-center items-center tablet:gap-[20px] gap-[16px] flex">
          <div className="self-stretch flex-col justify-start items-center tablet:gap-[8px] gap-[6px] flex">
            <div className="self-stretch flex-col justify-start items-start tablet:gap-[4px] gap-[2px] flex">
              <h3 className="text-label-common_5 w-full text-center leading-[150%] text-inherit text-lg font-semibold" style={{ color: '#313142' }}>
                로그인 오류 안내
              </h3>
            </div>
            <p className="text-label-common_3 w-full text-center whitespace-pre-wrap leading-[150%] text-inherit text-sm font-normal" style={{ color: '#8e8e93' }}>
              이메일 또는 비밀번호가 일치하지 않습니다.{'\n'}다시 확인해주세요.
            </p>
          </div>
        </div>
        <div className="flex self-stretch flex-col justify-start items-start gap-2">
          <button
            onClick={onClose}
            className="flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] text-white"
            style={{ 
              height: '56px', 
              width: '100%',
              backgroundColor: '#FF528D',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E8467A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF528D';
            }}
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginErrorModal; 