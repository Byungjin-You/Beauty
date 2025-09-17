import React from 'react';
import Modal from './Modal';
import { useRouter } from 'next/navigation';

interface IExistingAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExistingAccountModal: React.FC<IExistingAccountModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleLoginClick = () => {
    onClose();
    router.push('/auth/login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackdropClick={false}>
      <div className="tablet:w-[420px] w-[320px] tablet:p-[24px] p-[20px] tablet:pt-[32px] pt-[28px] flex-col justify-start items-center tablet:gap-[32px] gap-[20px] flex">
        <div className="self-stretch flex-col justify-center items-center tablet:gap-[20px] gap-[16px] flex">
          <div className="self-stretch flex-col justify-start items-center tablet:gap-[8px] gap-[6px] flex">
            <div className="self-stretch flex-col justify-start items-start tablet:gap-[4px] gap-[2px] flex">
              <h3 className="text-label-common_5 w-full text-center leading-[150%] text-inherit text-lg font-semibold" style={{ color: '#313142' }}>
                이미 가입된 계정입니다
              </h3>
            </div>
            <p className="text-label-common_3 w-full text-center whitespace-pre-wrap leading-[150%] text-inherit text-sm font-normal" style={{ color: '#8e8e93' }}>
              등록된 이메일이에요{'\n'}로그인 혹은 다른 이메일을 입력해주세요
            </p>
          </div>
        </div>
        <div className="flex self-stretch flex-col justify-start items-start gap-2">
          <button
            onClick={handleLoginClick}
            className="flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] text-white transition-all duration-200"
            style={{
              height: '56px',
              width: '100%',
              backgroundColor: '#FF528D',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E8467A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF528D';
            }}
          >
            로그인
          </button>
          <button
            onClick={onClose}
            className="flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] transition-all duration-200"
            style={{
              height: '56px',
              width: '100%',
              backgroundColor: 'transparent',
              color: '#8e8e93',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExistingAccountModal; 