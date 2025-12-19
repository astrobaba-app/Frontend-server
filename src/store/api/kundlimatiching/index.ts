import axios, { AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6001/api';

// Kundli Matching Interfaces
export interface KundliMatchingRequest {
  boyName: string;
  boyDateOfBirth: string; // YYYY-MM-DD
  boyTimeOfBirth: string; // HH:MM
  boyPlaceOfBirth: string;
  boyLatitude: number;
  boyLongitude: number;
  girlName: string;
  girlDateOfBirth: string;
  girlTimeOfBirth: string;
  girlPlaceOfBirth: string;
  girlLatitude: number;
  girlLongitude: number;
}

export interface KutaDetails {
  name: string;
  male?: string;
  female?: string;
  male_attracts_female?: boolean;
  female_attracts_male?: boolean;
  count?: number;
  enhanced_description?: string;
  tara_number?: number;
  male_lord?: string;
  female_lord?: string;
  sign_difference?: number;
  points: number;
  max_points: number;
  description: string;
  critical?: boolean;
  favorable?: boolean;
}

export interface AshtakootDetails {
  kutas: {
    varna: KutaDetails;
    vashya: KutaDetails;
    tara: KutaDetails;
    yoni: KutaDetails;
    graha_maitri: KutaDetails;
    gana: KutaDetails;
    bhakoot: KutaDetails;
    nadi: KutaDetails;
  };
  total_points: number;
  max_points: number;
  percentage: number;
  male_moon_sign?: string;
  female_moon_sign?: string;
  male_moon_nakshatra?: string;
  female_moon_nakshatra?: string;
  complexity?: string;
  compatibility: string;
  recommendation: string;
  critical_issues: string[];
}

export interface DashakootDetails {
  kutas: {
    varna: KutaDetails;
    vashya: KutaDetails;
    tara: KutaDetails;
    yoni: KutaDetails;
    graha_maitri: KutaDetails;
    gana: KutaDetails;
    bhakoot: KutaDetails;
    nadi: KutaDetails;
    mahendra: KutaDetails;
    stree_deergha: KutaDetails;
  };
  total_points: number;
  max_points: number;
  percentage: number;
  compatibility: string;
  recommendation: string;
  critical_issues: string[];
  ashtakoot_score: number;
  additional_kutas_score: number;
}

export interface ManglikDetails {
  male_manglik: boolean;
  female_manglik: boolean;
  male_manglik_details: {
    present: boolean;
    description: string;
    aspects?: string[];
    houses?: string[];
  };
  female_manglik_details: {
    present: boolean;
    description: string;
    aspects?: string[];
    houses?: string[];
  };
}

export interface PlanetDetail {
  name: string;
  sign?: string;
  signLord?: string;
  degree?: number;
  nakshatra?: string;
  nakshatraLord?: string;
  house?: number;
  avastha?: string;
}

export interface KundliMatchingData {
  id: string;
  userId: string;
  boyName: string;
  boyDateOfBirth: string;
  boyTimeOfBirth: string;
  boyPlaceOfBirth: string;
  boyLatitude: number;
  boyLongitude: number;
  girlName: string;
  girlDateOfBirth: string;
  girlTimeOfBirth: string;
  girlPlaceOfBirth: string;
  girlLatitude: number;
  girlLongitude: number;
  compatibilityScore: number;
  ashtakootDetails: AshtakootDetails;
  dashakootDetails: DashakootDetails;
  manglikDetails: ManglikDetails;
  boyPlanetDetails?: PlanetDetail[];
  girlPlanetDetails?: PlanetDetail[];
  boyLagnaChart?: any;
  girlLagnaChart?: any;
  boyAscendant?: { sign: string; sign_num: number; degree: number };
  girlAscendant?: { sign: string; sign_num: number; degree: number };
  conclusion: string;
  createdAt: string;
  updatedAt: string;
}

export interface KundliMatchingResponse {
  success: boolean;
  message: string;
  matching: KundliMatchingData;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// API Function
export const createKundliMatching = async (
  data: KundliMatchingRequest
): Promise<KundliMatchingResponse> => {
  try {
    const response: AxiosResponse<KundliMatchingResponse> = await axios.post(
      `${BASE_URL}/kundli-matching/create`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data ||
      ({ message: 'Failed to create kundli matching', success: false } as ErrorResponse)
    );
  }
};
