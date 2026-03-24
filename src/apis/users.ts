import {
  mockGetMyInfo,
  mockSendVerificationCode,
  mockUpdateMedicalDepartment,
  mockUpdatePhoneNumber,
  mockVerifyLogin,
} from '@/mocks/api';

import type {
  ApiResponse,
  SendVerificationRequest,
  TokenResponse,
  UpdateMedicalDepartmentRequest,
  UpdatePhoneNumberRequest,
  UserResponse,
  VerifyCodeRequest,
} from './types';

// POST /api/auth/login - 전화번호 로그인
export const sendVerificationCode = async (data: SendVerificationRequest): Promise<ApiResponse> => {
  return mockSendVerificationCode(data);
};

// POST /api/auth/login/verify - 인증코드 확인 및 로그인
export const verifyLogin = async (data: VerifyCodeRequest): Promise<TokenResponse> => {
  return mockVerifyLogin(data);
};

// PATCH /api/auth/phone-number - 전화번호 변경
export const updatePhoneNumber = async (data: UpdatePhoneNumberRequest): Promise<TokenResponse> => {
  return mockUpdatePhoneNumber(data);
};

// PATCH /api/auth/medical-department - 진료과목 변경
export const updateMedicalDepartment = async (data: UpdateMedicalDepartmentRequest): Promise<ApiResponse> => {
  return mockUpdateMedicalDepartment(data);
};

// GET /api/auth/me - 내 정보 조회
export const getMyInfo = async (): Promise<UserResponse> => {
  return mockGetMyInfo();
};
