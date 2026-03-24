import { mockConfirmPayment, mockGetMyPayments, mockGetPaymentDetail } from '@/mocks/api';

import type { ApiResponse, PaymentConfirmRequest, PaymentConfirmResponse, PaymentResponse } from './types';

// POST /api/payments/confirm - 결제 확인
export const confirmPayment = async (data: PaymentConfirmRequest): Promise<ApiResponse<PaymentConfirmResponse>> => {
  return mockConfirmPayment(data);
};

// GET /api/payments - 내 결제 내역 조회
export const getMyPayments = async (): Promise<PaymentResponse[]> => {
  return mockGetMyPayments();
};

// GET /api/payments/{paymentId} - 결제 상세 정보 조회
export const getPaymentDetail = async (paymentId: number): Promise<PaymentResponse> => {
  return mockGetPaymentDetail(paymentId);
};
