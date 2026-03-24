import {
  mockBoardReservation,
  mockCancelReservation,
  mockCreateReservation,
  mockGetMyReservations,
  mockGetReservationDetail,
} from '@/mocks/api';

import type { ApiResponse, CreateReservationRequest, ReservationResponse } from './types';

// GET /api/reservations - 내 예약 목록 조회
export const getMyReservations = async (): Promise<ReservationResponse[]> => {
  return mockGetMyReservations();
};

// POST /api/reservations - 예약 생성
export const createReservation = async (data: CreateReservationRequest): Promise<ReservationResponse> => {
  return mockCreateReservation(data);
};

// POST /api/reservations/board - QR코드를 이용한 탑승 처리
export const boardReservation = async (qrCode: string): Promise<ApiResponse> => {
  return mockBoardReservation(qrCode);
};

// GET /api/reservations/{reservationId} - 예약 상세 정보 조회
export const getReservationDetail = async (reservationId: number): Promise<ReservationResponse> => {
  return mockGetReservationDetail(reservationId);
};

// DELETE /api/reservations/{reservationId} - 예약 취소
export const cancelReservation = async (reservationId: number): Promise<ApiResponse> => {
  return mockCancelReservation(reservationId);
};
