import { HStack, Text, VStack } from '@vapor-ui/core';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { checkActivePass, getActivePass } from '@/apis/passes';
import { createReservation } from '@/apis/reservations';
import { getRouteDetail } from '@/apis/routes';
import type { PassResponse, PaymentMethod, RouteResponse } from '@/apis/types';
import BackHeader from '@/components/BackHeader';
import NavButton from '@/components/NavButton';
import PaymentMethodSection from '@/components/PaymentMethodSection';
import RouteSummaryCard from '@/components/RouteSummaryCard';
import TermsAgreement from '@/components/terms/TermsAgreement';
import { useRouteStore } from '@/stores/routeStore';

export default function RouteConfirmPage() {
  const navigate = useNavigate();
  const {
    selectedRoute,
    selectedDate,
    paymentMethod,
    paymentService,
    hasTicket,
    setPaymentMethod,
    setPaymentService,
    setHasTicket,
    setReservationData,
  } = useRouteStore();

  const [activePass, setActivePass] = useState<PassResponse | null>(null);
  const [routeDetail, setRouteDetail] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Redirect if no route selected and fetch route detail
  useEffect(() => {
    if (!selectedRoute || !selectedDate) {
      navigate('/route');
      return;
    }

    // Fetch route detail
    async function fetchRouteDetail() {
      try {
        if (selectedRoute) {
          const apiResponse = await getRouteDetail(selectedRoute.id);

          // API 응답이 래퍼 형태인 경우 data 부분만 추출
          const routeData =
            apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse
              ? (apiResponse as any).data
              : apiResponse;

          setRouteDetail(routeData);
        }
      } catch (err) {
        console.error('Failed to fetch route detail:', err);
        // Fall back to selectedRoute from store if API fails
        if (selectedRoute) {
          setRouteDetail(selectedRoute);
        }
      }
    }

    fetchRouteDetail();
  }, [selectedRoute, selectedDate, navigate]);

  // Check pass status on component mount
  useEffect(() => {
    async function checkPassStatus() {
      try {
        const hasActivePass = await checkActivePass();
        setHasTicket(hasActivePass);

        if (hasActivePass) {
          const activePassData = await getActivePass();
          setActivePass(activePassData);
        }
      } catch (err) {
        console.error('Failed to check pass status:', err);
        // Default to no pass on error
        setHasTicket(false);
        setActivePass(null);
      }
    }

    checkPassStatus();
  }, [setHasTicket]);

  // Don't render if no route data
  if (!selectedRoute || !selectedDate || !routeDetail) {
    return (
      <div className='relative flex min-h-screen flex-col'>
        <div className='sticky top-0 z-60'>
          <BackHeader title='노선 확인/결제' />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <Text>노선 정보를 불러오는 중...</Text>
        </div>
      </div>
    );
  }

  // Calculate payment amount
  const calculateAmount = () => {
    if (paymentMethod === 'ticket' && hasTicket) {
      return 0;
    }
    return 5000;
  };

  const paymentAmount = calculateAmount();
  const isPaymentDisabled = (paymentMethod === 'ticket' && !hasTicket) || !termsAgreed;

  // Format selected date for display
  const formattedDate = format(selectedDate, 'yyyy.MM.dd(E)', { locale: ko });

  // Handle payment/reservation creation
  const handlePayment = async () => {
    if (!selectedRoute || !selectedDate) return;

    try {
      setLoading(true);
      setError(null);

      // 먼저 예약 생성
      const reservationData = {
        routeId: selectedRoute.id,
        reservationDate: format(selectedDate, 'yyyy-MM-dd'),
      };

      const createdReservation = await createReservation(reservationData);
      console.log('Reservation created:', createdReservation);

      // Store reservation info for next page
      setReservationData({
        ...reservationData,
        reservationId: createdReservation.id,
        paymentMethod: paymentMethod === 'ticket' ? undefined : (paymentService.toUpperCase() as PaymentMethod),
        amount: paymentAmount,
      });

      // Mock 모드: 바로 결과 페이지로 이동
      navigate(`/reservation-result?reservationId=${createdReservation.id}`, { replace: true });
    } catch (err) {
      console.error('Payment/reservation failed:', err);
      setError(err instanceof Error ? err.message : '예약 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='relative flex min-h-screen flex-col'>
      <div className='sticky top-0 z-60'>
        <BackHeader title='노선 확인/결제' />
      </div>
      <div className='flex-1 overflow-y-auto'>
        {/* 노선 + 요일 시간 */}
        <VStack className='gap-5' paddingX='$300' paddingY='$250'>
          <HStack alignItems='center' justifyContent='space-between'>
            <Text
              className='leading-[137.5%] font-semibold tracking-[var(--vapor-typography-letterSpacing-100)]'
              foreground='normal'
            >
              노선
            </Text>
            <Text foreground='normal' typography='body1'>
              {formattedDate}
            </Text>
          </HStack>
          {/* 출발지 + 도착지 */}
          <RouteSummaryCard
            arriveName={routeDetail.hospitalName || ''}
            arriveTime={routeDetail.endAt ? routeDetail.endAt.substring(0, 5) : ''}
            departName={routeDetail.pickupLocation || ''}
            departTime={routeDetail.startAt ? routeDetail.startAt.substring(0, 5) : ''}
          />
        </VStack>
        <div className='h-2.5 bg-[#F7F7F7]' />

        {/* 결제 수단 선택 */}
        <VStack className='gap-5' paddingX='$300' paddingY='$250'>
          <Text
            className='leading-[137.5%] font-semibold tracking-[var(--vapor-typography-letterSpacing-100)]'
            foreground='normal'
          >
            결제수단
          </Text>

          {/* ═══════════════ 결제 수단 선택 컴포넌트 ═══════════════ */}
          <PaymentMethodSection
            hasTicket={hasTicket}
            selected={paymentMethod}
            selectedPaymentService={paymentService}
            ticketName={
              activePass?.passType === 'ONE_MONTH'
                ? '1개월권'
                : activePass?.passType === 'THREE_MONTHS'
                  ? '3개월권'
                  : '6개월권'
            }
            ticketPeriod={activePass ? `${activePass.startDate}–${activePass.endDate}` : ''}
            onPaymentMethodChange={setPaymentMethod}
            onPaymentServiceChange={setPaymentService}
          />
        </VStack>

        <div className='h-2.5 bg-[#F7F7F7]' />
        <HStack className='gap-5' justifyContent='space-between' paddingX='$300' paddingY='$250'>
          <Text
            className='leading-[137.5%] font-semibold tracking-[var(--vapor-typography-letterSpacing-100)]'
            foreground='normal'
          >
            결제 금액
          </Text>
          <Text className='text-[#3174DC]' typography='heading5'>
            {paymentAmount.toLocaleString()}원
          </Text>
        </HStack>
        <div className='h-2.5 bg-[#F7F7F7]' />
        <TermsAgreement onChange={(result) => setTermsAgreed(result.allAgreed)} />
      </div>
      <div className='sticky bottom-0 z-50 bg-white px-6 pt-2.5 pb-3 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)]'>
        {error && <Text style={{ color: '#D92D20', marginBottom: 8 }}>{error}</Text>}
        <NavButton
          disabled={isPaymentDisabled || loading}
          label={loading ? '처리중...' : paymentAmount === 0 ? '0원 예약' : '결제하기'}
          onClick={handlePayment}
        />
      </div>
    </div>
  );
}
