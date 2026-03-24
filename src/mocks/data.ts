import { addDays, format, subDays } from 'date-fns';

import type {
  InquiryResponse,
  PassResponse,
  PaymentResponse,
  ReservationResponse,
  RouteResponse,
  UserResponse,
} from '@/apis/types';

// ── Mock User ──
export const MOCK_USER: UserResponse = {
  id: 1,
  name: '홍길동',
  phoneNumber: '01012345678',
  email: 'demo@donghang.kr',
  medicalDepartment: 'INTERNAL_MEDICINE',
  loginType: 'KAKAO',
};

// ── Mock Routes ──
export const MOCK_ROUTES: RouteResponse[] = [
  {
    id: 1,
    hospitalName: '제주대학교병원',
    startAt: '08:30:00',
    endAt: '09:00:00',
    expectedTime: 30,
    remainedSeat: 12,
    totalSeat: 20,
    pickupLocation: '애월읍사무소 앞',
  },
  {
    id: 2,
    hospitalName: '제주대학교병원',
    startAt: '10:00:00',
    endAt: '10:30:00',
    expectedTime: 30,
    remainedSeat: 5,
    totalSeat: 20,
    pickupLocation: '고성1리 사무소 버스정류장',
  },
  {
    id: 3,
    hospitalName: '한라병원',
    startAt: '09:15:00',
    endAt: '09:55:00',
    expectedTime: 40,
    remainedSeat: 8,
    totalSeat: 15,
    pickupLocation: '고내 지발해변 정류장',
  },
  {
    id: 4,
    hospitalName: '서귀포의료원',
    startAt: '11:00:00',
    endAt: '11:45:00',
    expectedTime: 45,
    remainedSeat: 3,
    totalSeat: 15,
    pickupLocation: '중문관광단지 입구',
  },
  {
    id: 5,
    hospitalName: '제주대학교병원',
    startAt: '13:30:00',
    endAt: '14:00:00',
    expectedTime: 30,
    remainedSeat: 18,
    totalSeat: 20,
    pickupLocation: '한림공영버스터미널',
  },
];

// ── Mock Reservations ──
const today = new Date();

export const MOCK_RESERVATIONS: ReservationResponse[] = [
  {
    id: 1,
    reservationNumber: 'RSV-2024-001',
    reservationDate: format(addDays(today, 1), 'yyyy-MM-dd'),
    hospitalName: '제주대학교병원',
    startTime: '08:30:00',
    pickupLocation: '애월읍사무소 앞',
    medicalDepartment: 'INTERNAL_MEDICINE',
    status: 'CONFIRMED',
    boarded: false,
    qrCode: 'MOCK-QR-001',
  },
  {
    id: 2,
    reservationNumber: 'RSV-2024-002',
    reservationDate: format(today, 'yyyy-MM-dd'),
    hospitalName: '한라병원',
    startTime: '09:15:00',
    pickupLocation: '고내 지발해변 정류장',
    medicalDepartment: 'INTERNAL_MEDICINE',
    status: 'CONFIRMED',
    boarded: false,
    qrCode: 'MOCK-QR-002',
  },
  {
    id: 3,
    reservationNumber: 'RSV-2024-003',
    reservationDate: format(subDays(today, 3), 'yyyy-MM-dd'),
    hospitalName: '서귀포의료원',
    startTime: '11:00:00',
    pickupLocation: '중문관광단지 입구',
    medicalDepartment: 'INTERNAL_MEDICINE',
    status: 'COMPLETED',
    boarded: true,
    qrCode: 'MOCK-QR-003',
  },
];

// ── Mock Passes ──
export const MOCK_PASSES: PassResponse[] = [];

// ── Mock Payments ──
export const MOCK_PAYMENTS: PaymentResponse[] = [
  {
    id: 1,
    amount: 5000,
    paymentMethod: 'TOSS_PAY',
    status: 'COMPLETED',
    transactionId: 'TXN-MOCK-001',
    createdAt: format(subDays(today, 3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 2,
    amount: 15000,
    paymentMethod: 'TOSS_PAY',
    status: 'COMPLETED',
    transactionId: 'TXN-MOCK-002',
    createdAt: format(subDays(today, 15), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

// ── Mock Inquiries ──
export const MOCK_INQUIRIES: InquiryResponse[] = [
  {
    id: 1,
    title: '정기권 환불 문의',
    content: '정기권을 구매했는데 환불이 가능한가요?',
    status: 'ANSWERED',
    answer: '정기권은 구매 후 7일 이내에 환불 가능합니다. 고객센터로 연락 부탁드립니다.',
    createdAt: format(subDays(today, 5), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 2,
    title: '노선 추가 요청',
    content: '서귀포 시내에서 출발하는 노선도 추가해주세요.',
    status: 'PENDING',
    answer: '',
    createdAt: format(subDays(today, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

// ── ID Counters ──
export const nextReservationId = 100;
export const nextPassId = 100;
export const nextPaymentId = 100;
export const nextInquiryId = 100;
