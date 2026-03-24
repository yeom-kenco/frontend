import { mockKakaoWebhook, mockTossWebhook } from '@/mocks/api';

import type { ApiResponse, KakaoWebhookPayload, TossWebhookPayload } from './types';

// POST /webhook/payments/toss - Toss 결제 웹훅
export const tossWebhook = async (data: TossWebhookPayload): Promise<ApiResponse> => {
  return mockTossWebhook(data);
};

// POST /webhook/payments/kakao - 카카오페이 결제 웹훅
export const kakaoWebhook = async (data: KakaoWebhookPayload): Promise<ApiResponse> => {
  return mockKakaoWebhook(data);
};
