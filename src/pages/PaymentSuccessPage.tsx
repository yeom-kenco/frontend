import { Text, VStack } from '@vapor-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { confirmPayment } from '@/apis/payments';
import { createReservation } from '@/apis/reservations';
import type { PaymentConfirmRequest } from '@/apis/types';
import BackHeader from '@/components/BackHeader';
import NavButton from '@/components/NavButton';

interface ReservationData {
  routeId: number;
  reservationDate: string;
  paymentMethod: string;
  amount: number;
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPassPayment, setIsPassPayment] = useState(false);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // URL에서 결제 정보 추출
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');

        // sessionStorage에서 예약 또는 정기권 정보 가져오기
        const pendingReservationStr = sessionStorage.getItem('pendingReservation');
        const pendingPassStr = sessionStorage.getItem('pendingPass');

        if (paymentKey && orderId && amount) {
          // 실제 결제 플로우 (Toss/Kakao에서 리다이렉트)
          if (!pendingReservationStr && !pendingPassStr) {
            throw new Error('결제 정보를 찾을 수 없습니다.');
          }

          const isPass = !!pendingPassStr;
          setIsPassPayment(isPass);

          const paymentConfirmData: PaymentConfirmRequest = {
            paymentKey,
            orderId,
            amount: parseInt(amount),
          };

          await confirmPayment(paymentConfirmData);

          if (isPass) {
            sessionStorage.removeItem('pendingPass');
          } else {
            const reservationData = JSON.parse(pendingReservationStr!) as ReservationData;
            await createReservation({
              routeId: reservationData.routeId,
              reservationDate: reservationData.reservationDate,
            });
            sessionStorage.removeItem('pendingReservation');
          }
        } else {
          // Mock 모드: URL 파라미터 없이 직접 진입
          if (pendingPassStr) {
            setIsPassPayment(true);
            sessionStorage.removeItem('pendingPass');
          } else if (pendingReservationStr) {
            setIsPassPayment(false);
            sessionStorage.removeItem('pendingReservation');
          }
          // 파라미터도 sessionStorage도 없으면 정기권 결제 성공으로 처리
          if (!pendingReservationStr && !pendingPassStr) {
            setIsPassPayment(true);
          }
        }

        setSuccess(true);
      } catch (err) {
        console.error('결제 처리 실패:', err);
        setError(err instanceof Error ? err.message : '결제 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  const handleGoToReservation = () => {
    navigate('/reservation-result');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className='relative flex min-h-screen flex-col'>
        <div className='sticky top-0 z-60'>
          <BackHeader title='결제 처리' />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <VStack alignItems='center' className='gap-4'>
            <Text typography='heading5'>결제를 처리하고 있습니다...</Text>
            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600' />
          </VStack>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='relative flex min-h-screen flex-col'>
        <div className='sticky top-0 z-60'>
          <BackHeader title='결제 오류' />
        </div>
        <div className='flex flex-1 items-center justify-center px-6'>
          <VStack alignItems='center' className='gap-6'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
              <Text className='text-2xl text-red-600'>✕</Text>
            </div>
            <VStack alignItems='center' className='gap-2'>
              <Text className='text-red-600' typography='heading5'>
                결제 처리 실패
              </Text>
              <Text className='text-center text-gray-600' typography='body2'>
                {error}
              </Text>
            </VStack>
          </VStack>
        </div>
        <div className='sticky bottom-0 z-50 bg-white px-6 pt-2.5 pb-12 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)]'>
          <NavButton label='홈으로 돌아가기' onClick={handleGoToHome} />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className='relative flex min-h-screen flex-col'>
        <div className='sticky top-0 z-60'>
          <BackHeader title='결제 완료' />
        </div>
        <div className='flex flex-1 items-center justify-center px-6'>
          <VStack alignItems='center' className='gap-6'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
              <Text className='text-2xl text-green-600'>✓</Text>
            </div>
            <VStack alignItems='center' className='gap-2'>
              <Text className='text-green-600' typography='heading5'>
                결제가 완료되었습니다
              </Text>
              <Text className='text-center text-gray-600' typography='body2'>
                {isPassPayment ? '정기권 구매가 정상적으로 완료되었습니다.' : '셔틀 예약이 정상적으로 완료되었습니다.'}
              </Text>
            </VStack>
          </VStack>
        </div>
        <div className='sticky bottom-0 z-50 bg-white px-6 pt-2.5 pb-12 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)]'>
          <NavButton
            label={isPassPayment ? '정기권 관리' : '예약 내역 확인'}
            onClick={isPassPayment ? () => navigate('/season-ticket') : handleGoToReservation}
          />
        </div>
      </div>
    );
  }

  return null;
}
