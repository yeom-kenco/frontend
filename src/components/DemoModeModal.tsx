import { Button, Text, VStack } from '@vapor-ui/core';
import { useState } from 'react';

const STORAGE_KEY = 'demo-modal-seen';

export default function DemoModeModal() {
  const [isOpen, setIsOpen] = useState(() => !localStorage.getItem(STORAGE_KEY));

  if (!isOpen) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50' onClick={handleDismiss}>
      <div
        className='mx-6 w-full max-w-sm rounded-2xl bg-white px-6 py-8 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <VStack alignItems='center' gap='$200'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-blue-100'>
            <Text className='text-2xl text-blue-600'>i</Text>
          </div>
          <Text className='text-center' typography='heading4'>
            데모 모드 안내
          </Text>
          <Text className='text-center leading-relaxed text-gray-600' typography='body2'>
            현재 이 앱은 데모 모드로 동작하고 있습니다.
            <br />
            서버가 비활성화되어 모든 데이터는 가상 데이터로 제공됩니다.
            <br />
            <br />
            로그인, 예약, 결제 등 모든 기능을 체험하실 수 있지만 실제로 처리되지는 않습니다.
          </Text>
          <Button className='mt-2 w-full rounded-xl bg-[#4B84FF] py-3 font-semibold text-white' onClick={handleDismiss}>
            확인했습니다
          </Button>
        </VStack>
      </div>
    </div>
  );
}
