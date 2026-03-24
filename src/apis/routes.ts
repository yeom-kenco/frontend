import { mockGetRouteDetail, mockGetRoutes } from '@/mocks/api';

import type { RouteResponse } from './types';

// GET /api/routes/list - 노선 목록 조회
export const getRoutes = async (sortBy: string = 'default'): Promise<RouteResponse[]> => {
  return mockGetRoutes(sortBy);
};

// GET /api/routes/{routeId} - 노선 상세 정보 조회
export const getRouteDetail = async (routeId: number): Promise<RouteResponse> => {
  return mockGetRouteDetail(routeId);
};
