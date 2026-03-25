import { Switch } from '@vapor-ui/core';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getMyReservations } from '@/apis/reservations';
import type { ReservationResponse } from '@/apis/types';
import BackHeader from '@/components/BackHeader';
import NavButton from '@/components/NavButton';
import { useNotificationStore } from '@/stores/notificationStore';

const INTERVAL_PRESETS = [3, 7, 14, 30];

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const { enabled, intervalDays, setEnabled, setIntervalDays, setLastBoardingDate } = useNotificationStore();

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [tempInterval, setTempInterval] = useState<number | null>(intervalDays);
  const [customInput, setCustomInput] = useState('');
  const [lastBoarding, setLastBoarding] = useState<ReservationResponse | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function fetchLastBoarding() {
      try {
        const reservations = await getMyReservations();
        const completed = reservations
          .filter((r: ReservationResponse) => r.status === 'COMPLETED' && r.boarded)
          .sort((a: ReservationResponse, b: ReservationResponse) => b.reservationDate.localeCompare(a.reservationDate));
        if (completed.length > 0) {
          setLastBoarding(completed[0]);
          setLastBoardingDate(completed[0].reservationDate);
        }
      } catch {
        // mock이므로 에러 무시
      }
    }
    fetchLastBoarding();
  }, [setLastBoardingDate]);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const openBottomSheet = () => {
    setTempInterval(intervalDays);
    setCustomInput(intervalDays ? String(intervalDays) : '');
    setShowBottomSheet(true);
  };

  const handlePresetClick = (days: number) => {
    setTempInterval(days);
    setCustomInput(String(days));
  };

  const handleCustomInputChange = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    setCustomInput(num);
    if (num) {
      setTempInterval(Number(num));
    } else {
      setTempInterval(null);
    }
  };

  const handleConfirmInterval = () => {
    setIntervalDays(tempInterval);
    setShowBottomSheet(false);
  };

  const formatRelativeDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: false, locale: ko });
    } catch {
      return '';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'yyyy. M. d.');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className='relative flex min-h-screen flex-col bg-white'>
      <div className='sticky top-0 z-60 bg-white'>
        <BackHeader title='예약 알림 설정' onBack={() => navigate('/')} />
      </div>

      <div className='flex-1 overflow-y-auto px-5 pb-28'>
        {/* 알림 활성화 */}
        <div className='py-5'>
          <div className='flex items-center justify-between'>
            <span className='text-[15px] font-bold text-[#262626]'>알림 활성화</span>
            <Switch.Root checked={enabled} onCheckedChange={setEnabled}>
              <Switch.Thumb />
            </Switch.Root>
          </div>
          <p className='mt-2 text-[13px] leading-[18px] text-[#8C8C8C]'>
            탑승 예정일 전날 오전 10:00에 문자 또는
            <br />
            카카오톡 메시지로 알림을 보내드려요
          </p>
        </div>

        <div className='h-px bg-[#F0F0F0]' />

        {/* 예약 알림 주기 */}
        <div className='py-5'>
          <div className='flex items-center justify-between'>
            <span className='text-[15px] font-bold text-[#262626]'>예약 알림 주기</span>
            <span className={`text-[14px] font-medium ${intervalDays ? 'text-[#3174DC]' : 'text-[#8C8C8C]'}`}>
              {intervalDays ? `${intervalDays}일 마다` : '기록 없음'}
            </span>
          </div>
          <p className='mt-2 text-[13px] text-[#8C8C8C]'>병원에 어떤 주기로 방문하시나요?</p>
          <button
            className='mt-3 w-full rounded-lg border border-[#3174DC] py-2.5 text-[14px] font-medium text-[#3174DC]'
            onClick={openBottomSheet}
          >
            입력하기
          </button>
        </div>

        <div className='h-px bg-[#F0F0F0]' />

        {/* 최근 탑승 기록 */}
        <div className='py-5'>
          <div className='flex items-center justify-between'>
            <span className='text-[15px] font-bold text-[#262626]'>최근 탑승 기록</span>
            <span className={`text-[14px] font-medium ${lastBoarding ? 'text-[#3174DC]' : 'text-[#8C8C8C]'}`}>
              {lastBoarding ? formatRelativeDate(lastBoarding.reservationDate) : '기록 없음'}
            </span>
          </div>
          {lastBoarding ? (
            <p className='mt-2 text-[13px] text-[#8C8C8C]'>{formatDate(lastBoarding.reservationDate)}</p>
          ) : (
            <p className='mt-2 text-[13px] text-[#8C8C8C]'>아직 탑승 및 진료 기록이 없어요</p>
          )}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className='sticky bottom-0 z-50 bg-white px-5 pt-3 pb-7 shadow-[0_-4px_20px_0_rgba(0,0,0,0.08)]'>
        <NavButton label='저장' onClick={handleSave} />
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className='fixed inset-x-0 bottom-24 z-[200] flex justify-center'>
          <div className='rounded-xl bg-[#262626] px-6 py-3 text-[14px] font-medium text-white shadow-lg'>
            예약 알림 설정이 완료되었습니다!
          </div>
        </div>
      )}

      {/* 바텀시트 */}
      {showBottomSheet && (
        <>
          <div className='fixed inset-0 z-[90] bg-black/40' onClick={() => setShowBottomSheet(false)} />

          <div className='fixed inset-x-0 bottom-0 z-[100] mx-auto max-w-md rounded-t-2xl bg-white px-5 pt-5 pb-8'>
            {/* 헤더 */}
            <div className='flex items-center justify-between'>
              <span className='text-[16px] font-bold text-[#262626]'>예약 알림 주기</span>
              <button className='p-1 text-[#8C8C8C]' onClick={() => setShowBottomSheet(false)}>
                <svg fill='none' height='20' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24' width='20'>
                  <path d='M18 6L6 18M6 6l12 12' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </button>
            </div>

            <p className='mt-2 text-[13px] leading-[18px] text-[#8C8C8C]'>
              병원에 어떤 주기로 방문하시나요?
              <br />
              최근 탑승 기록일을 기준으로 알림 주기가 시작돼요
            </p>

            {/* 직접 입력 */}
            <div className='mt-5 rounded-lg border border-[#E0E0E0] px-4 py-3'>
              <input
                className='w-full text-[16px] text-[#262626] outline-none placeholder:text-[#BFBFBF]'
                inputMode='numeric'
                placeholder='직접 입력'
                type='text'
                value={customInput}
                onChange={(e) => handleCustomInputChange(e.target.value)}
              />
            </div>

            {/* 프리셋 칩 */}
            <div className='mt-3 flex gap-2'>
              {INTERVAL_PRESETS.map((days) => (
                <button
                  key={days}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
                    tempInterval === days
                      ? 'border-[#3174DC] bg-[#3174DC] text-white'
                      : 'border-[#E0E0E0] bg-white text-[#262626]'
                  }`}
                  onClick={() => handlePresetClick(days)}
                >
                  {days}일
                </button>
              ))}
            </div>

            {/* 완료 버튼 */}
            <button
              className={`mt-8 w-full rounded-2xl py-4 text-[15px] font-semibold text-white ${
                tempInterval ? 'bg-[#3174DC]' : 'bg-[#E0E0E0]'
              }`}
              disabled={!tempInterval}
              onClick={handleConfirmInterval}
            >
              완료
            </button>
          </div>
        </>
      )}
    </div>
  );
}
