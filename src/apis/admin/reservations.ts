import { mockGetAllReservations } from '@/mocks/api';

import type { ReservationResponse } from '../types';

// GET /api/admin/reservations - 모든 예약 조회 (관리자)
export const getAllReservations = async (): Promise<ReservationResponse[]> => {
  return mockGetAllReservations();
};
