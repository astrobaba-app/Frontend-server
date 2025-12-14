import api from '../index';
import { AxiosResponse } from 'axios';

export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

// Planet Transit Data
export interface PlanetTransit {
  longitude: number;
  latitude: number;
  speed: number;
  sign: string;
  degree: number;
  nakshatra: {
    name: string;
    number: number;
    pada: number;
    lord: string;
  };
  is_retrograde: boolean;
}

// Daily Horoscope Response
export interface DailyHoroscopeResponse {
  success: boolean;
  zodiacSign: string;
  horoscope: {
    sign: string;
    date?: string;
    day?: string;
    period: string;
    moon_phase?: string;
    sign_lord?: string;
    lord_position?: {
      sign: string;
      nakshatra: string;
      retrograde: boolean;
    };
    transits?: {
      [planet: string]: PlanetTransit;
    };
    transit_strengths?: {
      [planet: string]: string;
    };
    predictions: {
      overall: {
        rating: number;
        summary: string;
        key_factors?: string[];
      };
      career: {
        rating: number;
        prediction: string;
        advice: string;
        factors?: string[];
      };
      love: {
        rating: number;
        prediction: string;
        advice: string;
        factors?: string[];
      };
      health: {
        rating: number;
        prediction: string;
        advice: string;
        factors?: string[];
      };
      finance: {
        rating: number;
        prediction: string;
        advice: string;
        factors?: string[];
      };
    };
    lucky_elements?: {
      color?: string;
      colors?: string[];
      number?: number;
      time?: string;
      direction?: string;
      gemstone?: string;
      day_quality?: string;
    };
    remedies?: Array<{
      type: string;
      planet?: string;
      nakshatra?: string;
      mantra?: string;
      mantra_count?: string;
      action: string;
      charity?: string;
      benefit?: string;
    }>;
  };
}

// Weekly Horoscope Response
export interface WeeklyHoroscopeResponse {
  success: boolean;
  zodiacSign: string;
  horoscope: {
    sign: string;
    start_date: string;
    end_date: string;
    period: string;
    key_transits?: {
      start_week?: { [planet: string]: PlanetTransit };
      mid_week?: { [planet: string]: PlanetTransit };
      end_week?: { [planet: string]: PlanetTransit };
    };
    transit_strengths?: {
      [planet: string]: string;
    };
    predictions: {
      overview: {
        summary: string;
        rating: number;
        key_theme?: string;
      };
      career: {
        rating: number;
        prediction: string;
        best_days?: string;
        action_items?: string[];
      };
      love: {
        rating: number;
        prediction: string;
        best_days?: string;
        advice?: string;
      };
      health: {
        rating: number;
        prediction: string;
        focus_areas?: string[];
        recommendation?: string;
      };
      finance: {
        rating: number;
        prediction: string;
        opportunities?: string;
        caution?: string;
      };
      days_breakdown?: {
        [day: string]: {
          date: string;
          day_lord: string;
          quality: string;
          focus: string;
        };
      };
    };
    lucky_days?: Array<{
      day: string;
      reason: string;
    }>;
    best_day?: {
      day: string;
      date: string;
      reason: string;
    };
  };
}

// Monthly Horoscope Response
export interface MonthlyHoroscopeResponse {
  success: boolean;
  zodiacSign: string;
  horoscope: {
    sign: string;
    month: string;
    start_date: string;
    end_date: string;
    period: string;
    key_transits?: {
      start?: { [planet: string]: PlanetTransit };
      week_2?: { [planet: string]: PlanetTransit };
      mid_month?: { [planet: string]: PlanetTransit };
      week_3?: { [planet: string]: PlanetTransit };
      end?: { [planet: string]: PlanetTransit };
    };
    predictions: {
      overview: {
        rating: number;
        summary: string;
        key_theme?: string;
        overall_advice?: string;
      };
      major_transits?: Array<{
        planet: string;
        event: string;
        impact: string;
        nature: string;
      }>;
      first_half?: string;
      second_half?: string;
      career: {
        rating: number;
        prediction: string;
        best_period?: string;
        opportunities?: string[];
        cautions?: string[];
      };
      love: {
        rating: number;
        prediction: string;
        singles?: string;
        committed?: string;
        best_dates?: string;
      };
      health: {
        rating: number;
        prediction: string;
        focus_areas?: string[];
        mental_health?: string;
        recommendation?: string;
      };
      finance: {
        rating: number;
        prediction: string;
        opportunities?: string[];
        cautions?: string[];
        best_investment_period?: string;
      };
      weekly_breakdown?: {
        week_1?: string;
        week_2?: string;
        week_3?: string;
        week_4?: string;
      };
    };
    best_dates?: Array<{
      date: string;
      day: string;
      reason: string;
      recommendation?: string;
    }>;
    challenging_dates?: Array<{
      date: string;
      day: string;
      reason: string;
      advice?: string;
    }>;
  };
}

// Yearly Horoscope Response
export interface YearlyHoroscopeResponse {
  success: boolean;
  zodiacSign: string;
  horoscope: {
    sign: string;
    year: number;
    period: string;
    quarterly_transits?: {
      [quarter: string]: { [planet: string]: PlanetTransit };
    };
    predictions: {
      overview: {
        rating: number;
        summary: string;
        jupiter_influence?: string;
        saturn_influence?: string;
        key_message?: string;
      };
      quarterly_predictions?: {
        [quarter: string]: {
          summary: string;
          focus: string;
          opportunities?: string[];
          challenges?: string[];
        };
      };
      career_business?: {
        summary: string;
        opportunities?: string[];
        challenges?: string[];
        best_months?: string[];
        advice?: string;
      };
      love_relationships?: {
        summary: string;
        singles?: string;
        committed?: string;
        challenges?: string[];
        best_months?: string[];
        advice?: string;
      };
      health_wellness?: {
        summary: string;
        focus_areas?: string[];
        vulnerable_periods?: string[];
        recommended_practices?: string[];
        advice?: string;
      };
      finance_wealth?: {
        summary: string;
        opportunities?: string[];
        best_investments?: string[];
        best_months?: string[];
        cautions?: string[];
        advice?: string;
      };
      spiritual_growth?: {
        summary: string;
        focus?: string[];
        benefits?: string;
        practices?: string[];
      };
      major_themes?: string[];
    };
    best_months?: Array<{
      month: string;
      quarter: string;
      rating: number;
      reasons?: string[];
      best_for?: string[];
    }>;
    challenging_periods?: Array<{
      period: string;
      reason: string;
      advice: string;
    }>;
  };
}

// Generic type for all horoscope responses
export type HoroscopeResponse = 
  | DailyHoroscopeResponse 
  | WeeklyHoroscopeResponse 
  | MonthlyHoroscopeResponse 
  | YearlyHoroscopeResponse;

export const getDailyHoroscope = async (zodiacSign: ZodiacSign): Promise<DailyHoroscopeResponse> => {
  try {
    const response: AxiosResponse<DailyHoroscopeResponse> = await api.get(`/horoscope/daily/${zodiacSign}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch daily horoscope', success: false };
  }
};

export const getWeeklyHoroscope = async (zodiacSign: ZodiacSign): Promise<WeeklyHoroscopeResponse> => {
  try {
    const response: AxiosResponse<WeeklyHoroscopeResponse> = await api.get(`/horoscope/weekly/${zodiacSign}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch weekly horoscope', success: false };
  }
};

export const getMonthlyHoroscope = async (zodiacSign: ZodiacSign): Promise<MonthlyHoroscopeResponse> => {
  try {
    const response: AxiosResponse<MonthlyHoroscopeResponse> = await api.get(`/horoscope/monthly/${zodiacSign}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch monthly horoscope', success: false };
  }
};

export const getYearlyHoroscope = async (zodiacSign: ZodiacSign): Promise<YearlyHoroscopeResponse> => {
  try {
    const response: AxiosResponse<YearlyHoroscopeResponse> = await api.get(`/horoscope/yearly/${zodiacSign}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch yearly horoscope', success: false };
  }
};
