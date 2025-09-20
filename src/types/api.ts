export interface AuthResponse {
  status: string;
  message: string;
  data: {
    token: string;
  };
}

export interface Offer {
  offer_name: string;
  description: string;
  preview_url: string;
  offer_id: number;
  merchant_id: number;
  currency: string;
  logo: string;
  lookup_value: string;
  datetime_updated: string;
  countries: string;
  categories: string;
  commissions: Array<{
    Commission: string;
  }>;
  validation_terms: string;
  payment_terms: string;
  tracking_link: string;
  tracking_type: string;
  commission_tracking: string;
  directory_page: string;
}

export interface OffersResponse {
  status: string;
  message: string;
  data: {
    page: number;
    limit: number;
    count: number;
    nextPage?: number;
    data: Offer[];
  };
}

export interface DeeplinkRequest {
  offer_id: number;
  url: string;
  aff_sub?: string;
  aff_sub2?: string;
  aff_sub3?: string;
  aff_sub4?: string;
  aff_sub5?: string;
}

export interface DeeplinkResponse {
  status: string;
  message: string;
  data: {
    offer_name: string;
    offer_id: number;
    merchant_id: number;
    tracking_link: string;
  };
}

export interface GeneratedLink extends DeeplinkResponse['data'] {
  original_url: string;
  generated_at: string;
  aff_subs?: {
    aff_sub?: string;
    aff_sub2?: string;
    aff_sub3?: string;
    aff_sub4?: string;
    aff_sub5?: string;
  };
}