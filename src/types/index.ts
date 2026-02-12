export interface LinkResponse {
  id: string;
  originalUrl: string;
  slug: string;
  shortUrl: string;
  customAlias: boolean;
  title: string | null;
  totalClicks: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsResponse {
  totalClicks: number;
  timeline: TimelineData[];
  countries: BreakdownData[];
  devices: BreakdownData[];
  browsers: BreakdownData[];
  os: BreakdownData[];
  referrers: BreakdownData[];
}

export interface TimelineData {
  date: string;
  clicks: number;
}

export interface BreakdownData {
  name: string;
  count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
