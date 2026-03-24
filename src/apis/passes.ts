import { mockCancelPass, mockCheckActivePass, mockGetActivePass, mockGetMyPasses, mockPurchasePass } from '@/mocks/api';

import type { ApiResponse, PassResponse, PurchasePassRequest } from './types';

// POST /api/passes/purchase - 정기권 구매
export const purchasePass = async (data: PurchasePassRequest): Promise<PassResponse> => {
  return mockPurchasePass(data);
};

// GET /api/passes - 내 정기권 목록 조회
export const getMyPasses = async (): Promise<PassResponse[]> => {
  return mockGetMyPasses();
};

// GET /api/passes/check - 정기권 보유 여부 확인
export const checkActivePass = async (): Promise<boolean> => {
  return mockCheckActivePass();
};

// GET /api/passes/active - 활성 정기권 조회
export const getActivePass = async (): Promise<PassResponse> => {
  return mockGetActivePass();
};

// DELETE /api/passes/{passId} - 정기권 취소
export const cancelPass = async (passId: number): Promise<ApiResponse> => {
  return mockCancelPass(passId);
};
