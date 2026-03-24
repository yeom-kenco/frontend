import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoaderIcon from '@/assets/icons/LoaderIcon';

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Mock 모드: 바로 홈으로 이동
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className='relative flex min-h-screen flex-col'>
      <div className='flex flex-1 items-center justify-center'>
        <LoaderIcon aria-hidden className='size-40 animate-spin' />
      </div>
    </div>
  );
}
