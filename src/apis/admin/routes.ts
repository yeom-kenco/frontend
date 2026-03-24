import { mockCreateRoute, mockDeleteRoute, mockGetAllRoutes, mockUpdateRoute } from '@/mocks/api';

import type { ApiResponse, CreateRouteRequest, RouteResponse } from '../types';

// PUT /api/admin/routes/{routeId} - 노선 수정 (관리자)
export const updateRoute = async (routeId: number, data: CreateRouteRequest): Promise<ApiResponse> => {
  return mockUpdateRoute(routeId, data);
};

// DELETE /api/admin/routes/{routeId} - 노선 삭제 (관리자)
export const deleteRoute = async (routeId: number): Promise<ApiResponse> => {
  return mockDeleteRoute(routeId);
};

// GET /api/admin/routes - 모든 노선 조회 (관리자)
export const getAllRoutes = async (): Promise<RouteResponse[]> => {
  return mockGetAllRoutes();
};

// POST /api/admin/routes - 노선 생성 (관리자)
export const createRoute = async (data: CreateRouteRequest): Promise<RouteResponse> => {
  return mockCreateRoute(data);
};
