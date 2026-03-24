import {
  mockAnswerInquiry,
  mockCreateInquiry,
  mockGetAllInquiries,
  mockGetInquiryDetail,
  mockGetMyInquiries,
} from '@/mocks/api';

import type { AnswerInquiryRequest, ApiResponse, CreateInquiryRequest, InquiryResponse } from './types';

// GET /api/inquiries - 내 문의 목록 조회
export const getMyInquiries = async (): Promise<InquiryResponse[]> => {
  return mockGetMyInquiries();
};

// POST /api/inquiries - 문의 생성
export const createInquiry = async (data: CreateInquiryRequest): Promise<InquiryResponse> => {
  return mockCreateInquiry(data);
};

// POST /api/inquiries/{inquiryId}/answer - 문의 답변 등록 (관리자)
export const answerInquiry = async (inquiryId: number, data: AnswerInquiryRequest): Promise<ApiResponse> => {
  return mockAnswerInquiry(inquiryId, data);
};

// GET /api/inquiries/{inquiryId} - 문의 상세 정보 조회
export const getInquiryDetail = async (inquiryId: number): Promise<InquiryResponse> => {
  return mockGetInquiryDetail(inquiryId);
};

// GET /api/inquiries/admin/all - 모든 문의 조회 (관리자)
export const getAllInquiries = async (): Promise<InquiryResponse[]> => {
  return mockGetAllInquiries();
};
