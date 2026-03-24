import { addMonths, format } from 'date-fns';

import type {
  AnswerInquiryRequest,
  ApiResponse,
  CreateInquiryRequest,
  CreateReservationRequest,
  CreateRouteRequest,
  InquiryResponse,
  KakaoWebhookPayload,
  PassResponse,
  PaymentConfirmRequest,
  PaymentConfirmResponse,
  PaymentResponse,
  PurchasePassRequest,
  ReservationResponse,
  RouteResponse,
  SendVerificationRequest,
  TokenResponse,
  TossWebhookPayload,
  UpdateMedicalDepartmentRequest,
  UpdatePhoneNumberRequest,
  UserResponse,
  VerifyCodeRequest,
} from '@/apis/types';

import {
  MOCK_INQUIRIES,
  MOCK_PASSES,
  MOCK_PAYMENTS,
  MOCK_RESERVATIONS,
  MOCK_ROUTES,
  MOCK_USER,
  nextInquiryId,
  nextPassId,
  nextPaymentId,
  nextReservationId,
} from './data';

// ── Helper ──
const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

let _nextReservationId = nextReservationId;
let _nextPassId = nextPassId;
let _nextPaymentId = nextPaymentId;
let _nextInquiryId = nextInquiryId;

// ════════════════════════════════════════
// Users API
// ════════════════════════════════════════

export const mockSendVerificationCode = async (_data: SendVerificationRequest): Promise<ApiResponse> => {
  await delay();
  return { success: true, data: null, message: '인증코드가 발송되었습니다.' };
};

export const mockVerifyLogin = async (_data: VerifyCodeRequest): Promise<TokenResponse> => {
  await delay();
  return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
};

export const mockUpdatePhoneNumber = async (_data: UpdatePhoneNumberRequest): Promise<TokenResponse> => {
  await delay();
  return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
};

export const mockUpdateMedicalDepartment = async (data: UpdateMedicalDepartmentRequest): Promise<ApiResponse> => {
  await delay();
  MOCK_USER.medicalDepartment = data.medicalDepartment;
  return { success: true, data: null, message: '진료과목이 변경되었습니다.' };
};

export const mockGetMyInfo = async (): Promise<UserResponse> => {
  await delay();
  return { ...MOCK_USER };
};

// ════════════════════════════════════════
// Routes API
// ════════════════════════════════════════

export const mockGetRoutes = async (sortBy: string = 'default'): Promise<RouteResponse[]> => {
  await delay();
  const routes = [...MOCK_ROUTES];
  if (sortBy === 'startTime') {
    routes.sort((a, b) => a.startAt.localeCompare(b.startAt));
  } else if (sortBy === 'location') {
    routes.sort((a, b) => a.pickupLocation.localeCompare(b.pickupLocation));
  }
  return routes;
};

export const mockGetRouteDetail = async (routeId: number): Promise<RouteResponse> => {
  await delay();
  const route = MOCK_ROUTES.find((r) => r.id === routeId);
  if (!route) throw new Error('노선을 찾을 수 없습니다.');
  return { ...route };
};

// ════════════════════════════════════════
// Reservations API
// ════════════════════════════════════════

export const mockGetMyReservations = async (): Promise<ReservationResponse[]> => {
  await delay();
  return [...MOCK_RESERVATIONS];
};

export const mockCreateReservation = async (data: CreateReservationRequest): Promise<ReservationResponse> => {
  await delay();
  const route = MOCK_ROUTES.find((r) => r.id === data.routeId);
  const newReservation: ReservationResponse = {
    id: _nextReservationId++,
    reservationNumber: `RSV-MOCK-${_nextReservationId}`,
    reservationDate: data.reservationDate,
    hospitalName: route?.hospitalName || '제주대학교병원',
    startTime: route?.startAt || '09:00:00',
    pickupLocation: route?.pickupLocation || '애월읍사무소 앞',
    medicalDepartment: MOCK_USER.medicalDepartment,
    status: 'CONFIRMED',
    boarded: false,
    qrCode: `MOCK-QR-${_nextReservationId}`,
  };
  MOCK_RESERVATIONS.push(newReservation);
  return { ...newReservation };
};

export const mockGetReservationDetail = async (reservationId: number): Promise<ReservationResponse> => {
  await delay();
  const reservation = MOCK_RESERVATIONS.find((r) => r.id === reservationId);
  if (!reservation) throw new Error('예약을 찾을 수 없습니다.');
  return { ...reservation };
};

export const mockCancelReservation = async (reservationId: number): Promise<ApiResponse> => {
  await delay();
  const reservation = MOCK_RESERVATIONS.find((r) => r.id === reservationId);
  if (reservation) reservation.status = 'CANCELLED';
  return { success: true, data: null, message: '예약이 취소되었습니다.' };
};

export const mockBoardReservation = async (_qrCode: string): Promise<ApiResponse> => {
  await delay();
  const reservation = MOCK_RESERVATIONS.find((r) => r.qrCode === _qrCode);
  if (reservation) reservation.boarded = true;
  return { success: true, data: null, message: '탑승 처리되었습니다.' };
};

// ════════════════════════════════════════
// Payments API
// ════════════════════════════════════════

export const mockConfirmPayment = async (data: PaymentConfirmRequest): Promise<ApiResponse<PaymentConfirmResponse>> => {
  await delay();
  const response: PaymentConfirmResponse = {
    paymentKey: data.paymentKey,
    orderId: data.orderId,
    transactionId: `TXN-MOCK-${_nextPaymentId++}`,
    amount: data.amount,
    status: 'COMPLETED',
    approvedAt: new Date().toISOString(),
  };
  return { success: true, data: response, message: '결제가 승인되었습니다.' };
};

export const mockGetMyPayments = async (): Promise<PaymentResponse[]> => {
  await delay();
  return [...MOCK_PAYMENTS];
};

export const mockGetPaymentDetail = async (paymentId: number): Promise<PaymentResponse> => {
  await delay();
  const payment = MOCK_PAYMENTS.find((p) => p.id === paymentId);
  if (!payment) throw new Error('결제 정보를 찾을 수 없습니다.');
  return { ...payment };
};

// ════════════════════════════════════════
// Passes API
// ════════════════════════════════════════

export const mockPurchasePass = async (data: PurchasePassRequest): Promise<PassResponse> => {
  await delay();
  const now = new Date();
  let endDate: Date;
  let price: number;

  switch (data.passType) {
    case 'ONE_MONTH':
      endDate = addMonths(now, 1);
      price = 15000;
      break;
    case 'THREE_MONTHS':
      endDate = addMonths(now, 3);
      price = 40000;
      break;
    case 'SIX_MONTHS':
      endDate = addMonths(now, 6);
      price = 75000;
      break;
  }

  const newPass: PassResponse = {
    id: _nextPassId++,
    passType: data.passType,
    startDate: format(now, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
    price,
    status: 'ACTIVE',
    valid: true,
  };
  MOCK_PASSES.push(newPass);
  return { ...newPass };
};

export const mockGetMyPasses = async (): Promise<PassResponse[]> => {
  await delay();
  return [...MOCK_PASSES];
};

export const mockCheckActivePass = async (): Promise<boolean> => {
  await delay();
  return MOCK_PASSES.some((p) => p.status === 'ACTIVE');
};

export const mockGetActivePass = async (): Promise<PassResponse> => {
  await delay();
  const activePass = MOCK_PASSES.find((p) => p.status === 'ACTIVE');
  if (!activePass) throw new Error('활성 정기권이 없습니다.');
  return { ...activePass };
};

export const mockCancelPass = async (passId: number): Promise<ApiResponse> => {
  await delay();
  const pass = MOCK_PASSES.find((p) => p.id === passId);
  if (pass) {
    pass.status = 'CANCELLED';
    pass.valid = false;
  }
  return { success: true, data: null, message: '정기권이 취소되었습니다.' };
};

// ════════════════════════════════════════
// Inquiries API
// ════════════════════════════════════════

export const mockGetMyInquiries = async (): Promise<InquiryResponse[]> => {
  await delay();
  return [...MOCK_INQUIRIES];
};

export const mockCreateInquiry = async (data: CreateInquiryRequest): Promise<InquiryResponse> => {
  await delay();
  const newInquiry: InquiryResponse = {
    id: _nextInquiryId++,
    title: data.title,
    content: data.content,
    status: 'PENDING',
    answer: '',
    createdAt: new Date().toISOString(),
  };
  MOCK_INQUIRIES.push(newInquiry);
  return { ...newInquiry };
};

export const mockAnswerInquiry = async (inquiryId: number, data: AnswerInquiryRequest): Promise<ApiResponse> => {
  await delay();
  const inquiry = MOCK_INQUIRIES.find((i) => i.id === inquiryId);
  if (inquiry) {
    inquiry.answer = data.answer;
    inquiry.status = 'ANSWERED';
  }
  return { success: true, data: null, message: '답변이 등록되었습니다.' };
};

export const mockGetInquiryDetail = async (inquiryId: number): Promise<InquiryResponse> => {
  await delay();
  const inquiry = MOCK_INQUIRIES.find((i) => i.id === inquiryId);
  if (!inquiry) throw new Error('문의를 찾을 수 없습니다.');
  return { ...inquiry };
};

export const mockGetAllInquiries = async (): Promise<InquiryResponse[]> => {
  await delay();
  return [...MOCK_INQUIRIES];
};

// ════════════════════════════════════════
// Admin Routes API
// ════════════════════════════════════════

export const mockGetAllRoutes = async (): Promise<RouteResponse[]> => {
  await delay();
  return [...MOCK_ROUTES];
};

export const mockCreateRoute = async (_data: CreateRouteRequest): Promise<RouteResponse> => {
  await delay();
  return { ...MOCK_ROUTES[0], id: Date.now() };
};

export const mockUpdateRoute = async (_routeId: number, _data: CreateRouteRequest): Promise<ApiResponse> => {
  await delay();
  return { success: true, data: null, message: '노선이 수정되었습니다.' };
};

export const mockDeleteRoute = async (_routeId: number): Promise<ApiResponse> => {
  await delay();
  return { success: true, data: null, message: '노선이 삭제되었습니다.' };
};

// ════════════════════════════════════════
// Admin Reservations API
// ════════════════════════════════════════

export const mockGetAllReservations = async (): Promise<ReservationResponse[]> => {
  await delay();
  return [...MOCK_RESERVATIONS];
};

// ════════════════════════════════════════
// Webhooks (no-op)
// ════════════════════════════════════════

export const mockTossWebhook = async (_data: TossWebhookPayload): Promise<ApiResponse> => {
  await delay();
  return { success: true, data: null, message: 'ok' };
};

export const mockKakaoWebhook = async (_data: KakaoWebhookPayload): Promise<ApiResponse> => {
  await delay();
  return { success: true, data: null, message: 'ok' };
};
