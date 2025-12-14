# Horoscope API Documentation

## Overview
This document outlines the **ACTUAL** API response structure for all horoscope endpoints used by the frontend. The frontend is designed to work with 4 different time periods: **Daily**, **Weekly**, **Monthly**, and **Yearly**. 

**IMPORTANT**: This documentation reflects the actual API responses being returned by the backend. All fields and structures shown here are based on real API data.

**Frontend Display Sections**: The frontend displays 9 comprehensive sections:
1. **Overview** - Overall daily/weekly/monthly/yearly summary
2. **Love & Relationships** - Romantic predictions and advice
3. **Personal Life** - Derived from overall emotional factors
4. **Career & Finance** - Combined professional and financial guidance
5. **Health & Wellness** - Physical and mental health predictions
6. **Emotions & Mind** - Mental state and emotional guidance
7. **Lucky Insights** - Auspicious elements (colors, numbers, time, direction, gemstone)
8. **Travel & Movement** - Movement and direction guidance
9. **Remedies** - Vedic remedies and mantras

---

## Table of Contents
1. [Daily Horoscope API](#1-daily-horoscope-api)
2. [Weekly Horoscope API](#2-weekly-horoscope-api)
3. [Monthly Horoscope API](#3-monthly-horoscope-api)
4. [Yearly Horoscope API](#4-yearly-horoscope-api)
5. [Common Structures](#5-common-structures)
6. [Frontend Consumption Guide](#6-frontend-consumption-guide)

---

## 1. Daily Horoscope API

### Endpoint
```
GET /horoscope/daily/{zodiacSign}
```

### Parameters
- `zodiacSign` (path parameter): One of: `aries`, `taurus`, `gemini`, `cancer`, `leo`, `virgo`, `libra`, `scorpio`, `sagittarius`, `capricorn`, `aquarius`, `pisces`

### Response Structure

```typescript
interface DailyHoroscopeResponse {
  success: boolean;
  zodiacSign: string;
  horoscope: {
    sign: string;
    date?: string;                    // e.g., "2024-12-03" or "03 December 2024"
    day?: string;                     // e.g., "Tuesday"
    period: string;                   // Should be "Daily"
    moon_phase?: string;              // e.g., "Waxing Gibbous"
    sign_lord?: string;               // e.g., "Mars"
    lord_position?: {
      sign: string;                   // e.g., "Leo"
      nakshatra: string;              // e.g., "Magha"
      retrograde: boolean;
    };
    transits?: {
      [planet: string]: PlanetTransit;
    };
    transit_strengths?: {
      [planet: string]: string;       // e.g., "favorable", "neutral", "challenging"
    };
    predictions: {
      overall: {
        rating: number;               // 1-5
        summary: string;
        key_factors?: string[];
      };
      career: {
        rating: number;               // 1-5
        prediction: string;
        advice: string;
        factors?: string[];
      };
      love: {
        rating: number;               // 1-5
        prediction: string;
        advice: string;
        factors?: string[];
      };
      health: {
        rating: number;               // 1-5
        prediction: string;
        advice: string;
        factors?: string[];
      };
      finance: {
        rating: number;               // 1-5
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
```

### Example Response (Based on Actual API)
```json
{
  "success": true,
  "zodiacSign": "cancer",
  "horoscope": {
    "sign": "Cancer",
    "date": "2025-12-12",
    "day": "Friday",
    "period": "Daily",
    "moon_phase": "Last Quarter",
    "sign_lord": "Moon",
    "lord_position": {
      "sign": "Virgo",
      "nakshatra": "Uttara Phalguni",
      "retrograde": false
    },
    "transits": {
      "Sun": {
        "longitude": 236.55729742619292,
        "latitude": -0.0000069231672606362525,
        "speed": 0,
        "sign": "Scorpio",
        "degree": 26.557297426192918,
        "nakshatra": {
          "name": "Jyeshtha",
          "number": 18,
          "pada": 3,
          "lord": "Mercury"
        },
        "is_retrograde": false
      }
      // ... other planets
    },
    "transit_strengths": {
      "Sun": "Highly Beneficial",
      "Moon": "Beneficial",
      "Mars": "Challenging",
      "Mercury": "Highly Beneficial",
      "Jupiter": "Challenging",
      "Venus": "Highly Beneficial",
      "Saturn": "Highly Beneficial"
    },
    "predictions": {
      "overall": {
        "rating": 3,
        "summary": "Balanced day for Cancer. Mix of opportunities and challenges. Moon direct motion supports your endeavors",
        "key_factors": [
          "Moon direct motion supports your endeavors"
        ]
      },
      "career": {
        "rating": 3,
        "prediction": "Favorable Sun transit supports professional growth",
        "advice": "Focus on routine work and building professional relationships",
        "factors": [
          "Favorable Sun transit supports professional growth"
        ]
      },
      "love": {
        "rating": 2,
        "prediction": "Venus enhances romantic prospects",
        "advice": "Good day for spending quality time with loved ones",
        "factors": [
          "Venus enhances romantic prospects"
        ]
      },
      "health": {
        "rating": 2,
        "prediction": "Mars position advises caution with health",
        "advice": "Maintain regular exercise and healthy eating habits",
        "factors": [
          "Mars position advises caution with health"
        ]
      },
      "finance": {
        "rating": 1,
        "prediction": "Avoid major financial decisions",
        "advice": "Avoid risky investments. Focus on saving and financial review",
        "factors": [
          "Avoid major financial decisions"
        ]
      }
    },
    "lucky_elements": {
      "color": "White",
      "colors": [
        "White",
        "Silver",
        "Cream"
      ],
      "number": 4,
      "time": "6:00 AM - 7:00 AM",
      "direction": "South",
      "gemstone": "Pearl",
      "day_quality": "Auspicious"
    },
    "remedies": [
      {
        "type": "Sign Lord Remedy",
        "planet": "Moon",
        "mantra": "Om Chandraya Namaha",
        "mantra_count": "108 times",
        "action": "Offer milk to Lord Shiva",
        "charity": "Donate rice or white clothes"
      },
      {
        "type": "Nakshatra Remedy",
        "nakshatra": "Uttara Phalguni",
        "action": "Meditate during Moon in Uttara Phalguni",
        "benefit": "Enhances mental peace and intuition"
      }
    ]
  }
}
```

### Required Fields
- `success` ✅
- `zodiacSign` ✅
- `horoscope.sign` ✅
- `horoscope.period` ✅
- `horoscope.predictions.overall.rating` ✅
- `horoscope.predictions.overall.summary` ✅
- `horoscope.predictions.career.rating` ✅
- `horoscope.predictions.career.prediction` ✅
- `horoscope.predictions.love.rating` ✅
- `horoscope.predictions.love.prediction` ✅
- `horoscope.predictions.health.rating` ✅
- `horoscope.predictions.health.prediction` ✅
- `horoscope.predictions.finance.rating` ✅
- `horoscope.predictions.finance.prediction` ✅

All other fields are optional and will show `"--"` if not provided.

---

## 2. Weekly Horoscope API

### Endpoint
```
GET /horoscope/weekly/{zodiacSign}
```

### Parameters
- `zodiacSign` (path parameter): One of the 12 zodiac signs

### Response Structure

```typescript
interface WeeklyHoroscopeResponse {
  success: boolean;
  zodiacSign: string;
  horoscope: {
    sign: string;
    start_date: string;               // e.g., "2024-12-02"
    end_date: string;                 // e.g., "2024-12-08"
    period: string;                   // Should be "Weekly"
    key_transits?: {
      start_week?: {
        [planet: string]: PlanetTransit;
      };
      mid_week?: {
        [planet: string]: PlanetTransit;
      };
      end_week?: {
        [planet: string]: PlanetTransit;
      };
    };
    transit_strengths?: {
      [planet: string]: string;
    };
    predictions: {
      overview: {
        summary: string;
        rating: number;               // 1-5
        key_theme?: string;
      };
      career: {
        rating: number;               // 1-5
        prediction: string;
        best_days?: string;
        action_items?: string[];
      };
      love: {
        rating: number;               // 1-5
        prediction: string;
        best_days?: string;
        advice?: string;
      };
      health: {
        rating: number;               // 1-5
        prediction: string;
        focus_areas?: string[];
        recommendation?: string;
      };
      finance: {
        rating: number;               // 1-5
        prediction: string;
        opportunities?: string;
        caution?: string;
      };
      days_breakdown?: {
        Monday?: DayBreakdown;
        Tuesday?: DayBreakdown;
        Wednesday?: DayBreakdown;
        Thursday?: DayBreakdown;
        Friday?: DayBreakdown;
        Saturday?: DayBreakdown;
        Sunday?: DayBreakdown;
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

interface DayBreakdown {
  date: string;
  day_lord: string;
  quality: string;
  focus: string;
}
```

### Example Response (Based on Actual API)
```json
{
  "success": true,
  "zodiacSign": "cancer",
  "horoscope": {
    "sign": "Cancer",
    "start_date": "2025-12-12",
    "end_date": "2025-12-19",
    "period": "Weekly",
    "key_transits": {
      "start_week": {
        "Sun": {
          "longitude": 236.55729742619292,
          "latitude": -0.0000069231672606362525,
          "speed": 0,
          "sign": "Scorpio",
          "degree": 26.557297426192918,
          "nakshatra": {
            "name": "Jyeshtha",
            "number": 18,
            "pada": 3,
            "lord": "Mercury"
          },
          "is_retrograde": false
        }
        // ... other planets
      },
      "mid_week": {
        // ... planetary positions
      },
      "end_week": {
        // ... planetary positions
      }
    },
    "transit_strengths": {
      "Sun": "Highly Beneficial",
      "Moon": "Beneficial",
      "Mars": "Challenging",
      "Mercury": "Highly Beneficial",
      "Jupiter": "Challenging",
      "Venus": "Highly Beneficial",
      "Saturn": "Highly Beneficial"
    },
    "predictions": {
      "overview": {
        "summary": "Balanced week for Cancer. Mix of opportunities and challenges. Strategic planning yields best results.",
        "rating": 4,
        "key_theme": "Growth and Expansion"
      },
      "career": {
        "rating": 3,
        "prediction": "Steady professional week. Good for routine work and team collaboration. Plan strategically for coming opportunities.",
        "best_days": "Monday, Wednesday, Friday",
        "action_items": [
          "Complete pending projects",
          "Network with colleagues",
          "Update your skills"
        ]
      },
      "love": {
        "rating": 5,
        "prediction": "Romantic week ahead! Venus in favorable position enhances charm. Moon in Uttara Phalguni supports emotional connections.",
        "best_days": "Tuesday, Friday, Saturday",
        "advice": "Express feelings openly and listen actively"
      },
      "health": {
        "rating": 2,
        "prediction": "Exercise caution with health this week. Avoid stress and overexertion. Practice relaxation techniques.",
        "focus_areas": [
          "Mental wellness",
          "Physical fitness",
          "Nutrition"
        ],
        "recommendation": "Practice yoga or meditation daily"
      },
      "finance": {
        "rating": 2,
        "prediction": "Exercise financial caution. Avoid major purchases or investments. Review budgets carefully.",
        "opportunities": "Mid-week favors financial discussions",
        "caution": "Avoid impulsive spending on weekends"
      },
      "days_breakdown": {
        "Friday": {
          "date": "2025-12-12",
          "day_lord": "Venus",
          "quality": "Good",
          "focus": "Love, Arts, Luxury, Beauty"
        },
        "Saturday": {
          "date": "2025-12-13",
          "day_lord": "Saturn",
          "quality": "Average",
          "focus": "Hard work, Discipline, Karma"
        }
        // ... other days
      }
    },
    "lucky_days": [
      {
        "day": "Monday",
        "reason": "Moon is your sign lord"
      },
      {
        "day": "Thursday",
        "reason": "Jupiter brings natural benefits"
      },
      {
        "day": "Friday",
        "reason": "Venus brings natural benefits"
      }
    ],
    "best_day": {
      "day": "Friday",
      "date": "2025-12-12",
      "reason": "Ruled by Moon, your sign lord"
    }
  }
}
```

### Required Fields
- `success` ✅
- `zodiacSign` ✅
- `horoscope.sign` ✅
- `horoscope.start_date` ✅
- `horoscope.end_date` ✅
- `horoscope.period` ✅
- `horoscope.predictions.overview.summary` ✅
- `horoscope.predictions.overview.rating` ✅
- All prediction categories (career, love, health, finance) with rating and prediction ✅

---

## 3. Monthly Horoscope API

### Endpoint
```
GET /horoscope/monthly/{zodiacSign}
```

### Parameters
- `zodiacSign` (path parameter): One of the 12 zodiac signs

### Response Structure

```typescript
interface MonthlyHoroscopeResponse {
  success: boolean;
  zodiacSign: string;
  horoscope: {
    sign: string;
    month: string;                    // e.g., "December 2024"
    start_date: string;               // e.g., "2024-12-01"
    end_date: string;                 // e.g., "2024-12-31"
    period: string;                   // Should be "Monthly"
    key_transits?: {
      start?: {
        [planet: string]: PlanetTransit;
      };
      week_2?: {
        [planet: string]: PlanetTransit;
      };
      mid_month?: {
        [planet: string]: PlanetTransit;
      };
      week_3?: {
        [planet: string]: PlanetTransit;
      };
      end?: {
        [planet: string]: PlanetTransit;
      };
    };
    predictions: {
      overview: {
        rating: number;               // 1-5
        summary: string;
        key_theme?: string;
        overall_advice?: string;
      };
      major_transits?: Array<{
        planet: string;
        event: string;
        impact: string;
        nature: string;              // "favorable", "neutral", "challenging"
      }>;
      first_half?: string;
      second_half?: string;
      career: {
        rating: number;              // 1-5
        prediction: string;
        best_period?: string;
        opportunities?: string[];
        cautions?: string[];
      };
      love: {
        rating: number;              // 1-5
        prediction: string;
        singles?: string;
        committed?: string;
        best_dates?: string;
      };
      health: {
        rating: number;              // 1-5
        prediction: string;
        focus_areas?: string[];
        mental_health?: string;
        recommendation?: string;
      };
      finance: {
        rating: number;              // 1-5
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
```

### Example Response
```json
{
  "success": true,
  "zodiacSign": "aries",
  "horoscope": {
    "sign": "Aries",
    "month": "December 2024",
    "start_date": "2024-12-01",
    "end_date": "2024-12-31",
    "period": "Monthly",
    "key_transits": {
      "start": {
        "Sun": {
          "longitude": 225.456,
          "latitude": 0.0001,
          "speed": 1.016,
          "sign": "Scorpio",
          "degree": 15.456,
          "nakshatra": {
            "name": "Jyeshtha",
            "number": 18,
            "pada": 1,
            "lord": "Mercury"
          },
          "is_retrograde": false
        }
      },
      "mid_month": {
        "Sun": {
          "longitude": 240.789,
          "latitude": 0.0001,
          "speed": 1.012,
          "sign": "Sagittarius",
          "degree": 0.789,
          "nakshatra": {
            "name": "Mula",
            "number": 19,
            "pada": 1,
            "lord": "Ketu"
          },
          "is_retrograde": false
        }
      },
      "end": {
        "Sun": {
          "longitude": 254.123,
          "latitude": 0.0001,
          "speed": 1.018,
          "sign": "Sagittarius",
          "degree": 14.123,
          "nakshatra": {
            "name": "Purva Ashadha",
            "number": 20,
            "pada": 2,
            "lord": "Venus"
          },
          "is_retrograde": false
        }
      }
    },
    "predictions": {
      "overview": {
        "rating": 4,
        "summary": "December brings dynamic energy and opportunities for growth. The month starts with transformative Scorpio energy and shifts to optimistic Sagittarius vibes mid-month.",
        "key_theme": "Transformation and Expansion",
        "overall_advice": "Stay focused on your goals while remaining open to new opportunities"
      },
      "major_transits": [
        {
          "planet": "Sun",
          "event": "Sun enters Sagittarius on December 16",
          "impact": "Boosts optimism and adventure",
          "nature": "favorable"
        },
        {
          "planet": "Mercury",
          "event": "Mercury retrograde from December 13-28",
          "impact": "Communication challenges and delays",
          "nature": "challenging"
        }
      ],
      "first_half": "Focus on deep transformation and completing pending projects. Scorpio energy supports introspection and strategic planning.",
      "second_half": "Shift towards expansion and new beginnings. Sagittarius influence brings optimism and opportunities for growth.",
      "career": {
        "rating": 4,
        "prediction": "Professional life shows strong momentum. Leadership opportunities and recognition are likely, especially in the second half.",
        "best_period": "December 16-25",
        "opportunities": [
          "New project leadership",
          "Promotion discussions",
          "Networking events"
        ],
        "cautions": [
          "Avoid signing contracts during Mercury retrograde (Dec 13-28)",
          "Double-check all communications"
        ]
      },
      "love": {
        "rating": 3,
        "prediction": "Romance requires patience and clear communication this month. Mid-month brings lighter, more playful energy.",
        "singles": "New connections possible after December 20. Be open to meeting people through travel or educational settings.",
        "committed": "Focus on honest communication and shared goals. Plan an adventure together in the second half of the month.",
        "best_dates": "December 6, 20, 24"
      },
      "health": {
        "rating": 3,
        "prediction": "Energy levels fluctuate this month. Focus on maintaining balance between activity and rest.",
        "focus_areas": [
          "Regular exercise routine",
          "Stress management",
          "Immune system support"
        ],
        "mental_health": "Practice meditation or mindfulness to manage December stress",
        "recommendation": "Increase water intake and prioritize 7-8 hours of sleep nightly"
      },
      "finance": {
        "rating": 3,
        "prediction": "Financial matters remain stable with some unexpected expenses in the first half. Second half favors income growth.",
        "opportunities": [
          "Year-end bonuses",
          "Investment opportunities in real estate",
          "Side business growth"
        ],
        "cautions": [
          "Avoid major purchases before December 15",
          "Review holiday spending budget",
          "Be cautious with investments during Mercury retrograde"
        ],
        "best_investment_period": "December 20-31"
      },
      "weekly_breakdown": {
        "week_1": "Start strong with goal-setting and strategic planning. Mars energy supports action.",
        "week_2": "Mid-month brings communication challenges. Focus on clarity and patience.",
        "week_3": "Energy shifts towards optimism. Good time for networking and socializing.",
        "week_4": "End the year on a high note. Celebrate achievements and plan for the new year."
      }
    },
    "best_dates": [
      {
        "date": "2024-12-03",
        "day": "Tuesday",
        "reason": "Mars day aligns with Aries energy",
        "recommendation": "Take action on important career matters"
      },
      {
        "date": "2024-12-20",
        "day": "Friday",
        "reason": "Sun enters Sagittarius with Venus support",
        "recommendation": "Ideal for romantic gestures or social events"
      },
      {
        "date": "2024-12-24",
        "day": "Tuesday",
        "reason": "Jupiter's favorable aspect enhances luck",
        "recommendation": "Make important decisions or start new ventures"
      }
    ],
    "challenging_dates": [
      {
        "date": "2024-12-13",
        "day": "Friday",
        "reason": "Mercury retrograde begins",
        "advice": "Avoid signing contracts, back up data, double-check communications"
      },
      {
        "date": "2024-12-19",
        "day": "Thursday",
        "reason": "Mars-Saturn square creates tension",
        "advice": "Practice patience, avoid confrontations"
      }
    ]
  }
}
```

### Required Fields
- `success` ✅
- `zodiacSign` ✅
- `horoscope.sign` ✅
- `horoscope.month` ✅
- `horoscope.start_date` ✅
- `horoscope.end_date` ✅
- `horoscope.period` ✅
- `horoscope.predictions.overview.rating` ✅
- `horoscope.predictions.overview.summary` ✅
- All prediction categories with ratings and predictions ✅

---

## 4. Yearly Horoscope API

### Endpoint
```
GET /horoscope/yearly/{zodiacSign}
```

### Parameters
- `zodiacSign` (path parameter): One of the 12 zodiac signs

### Response Structure

```typescript
interface YearlyHoroscopeResponse {
  success: boolean;
  zodiacSign: string;
  horoscope: {
    sign: string;
    year: number;                     // e.g., 2025
    period: string;                   // Should be "Yearly"
    quarterly_transits?: {
      Q1?: {
        [planet: string]: PlanetTransit;
      };
      Q2?: {
        [planet: string]: PlanetTransit;
      };
      Q3?: {
        [planet: string]: PlanetTransit;
      };
      Q4?: {
        [planet: string]: PlanetTransit;
      };
    };
    predictions: {
      overview: {
        rating: number;               // 1-5
        summary: string;
        jupiter_influence?: string;
        saturn_influence?: string;
        key_message?: string;
      };
      quarterly_predictions?: {
        Q1?: QuarterPrediction;
        Q2?: QuarterPrediction;
        Q3?: QuarterPrediction;
        Q4?: QuarterPrediction;
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

interface QuarterPrediction {
  summary: string;
  focus: string;
  opportunities?: string[];
  challenges?: string[];
}
```

### Example Response
```json
{
  "success": true,
  "zodiacSign": "aries",
  "horoscope": {
    "sign": "Aries",
    "year": 2025,
    "period": "Yearly",
    "quarterly_transits": {
      "Q1": {
        "Jupiter": {
          "longitude": 45.234,
          "latitude": 0.543,
          "speed": 0.121,
          "sign": "Gemini",
          "degree": 15.234,
          "nakshatra": {
            "name": "Ardra",
            "number": 6,
            "pada": 3,
            "lord": "Rahu"
          },
          "is_retrograde": false
        },
        "Saturn": {
          "longitude": 330.567,
          "latitude": 1.234,
          "speed": 0.034,
          "sign": "Pisces",
          "degree": 0.567,
          "nakshatra": {
            "name": "Revati",
            "number": 27,
            "pada": 1,
            "lord": "Mercury"
          },
          "is_retrograde": false
        }
      },
      "Q2": {
        "Jupiter": {
          "longitude": 52.789,
          "latitude": 0.567,
          "speed": 0.098,
          "sign": "Gemini",
          "degree": 22.789,
          "nakshatra": {
            "name": "Punarvasu",
            "number": 7,
            "pada": 2,
            "lord": "Jupiter"
          },
          "is_retrograde": false
        }
      },
      "Q3": {
        "Jupiter": {
          "longitude": 58.123,
          "latitude": 0.589,
          "speed": 0.112,
          "sign": "Gemini",
          "degree": 28.123,
          "nakshatra": {
            "name": "Punarvasu",
            "number": 7,
            "pada": 4,
            "lord": "Jupiter"
          },
          "is_retrograde": false
        }
      },
      "Q4": {
        "Jupiter": {
          "longitude": 65.456,
          "latitude": 0.601,
          "speed": 0.125,
          "sign": "Cancer",
          "degree": 5.456,
          "nakshatra": {
            "name": "Pushya",
            "number": 8,
            "pada": 1,
            "lord": "Saturn"
          },
          "is_retrograde": false
        }
      }
    },
    "predictions": {
      "overview": {
        "rating": 4,
        "summary": "2025 brings significant opportunities for personal and professional growth. Jupiter's transit through your 3rd and 4th houses enhances communication, learning, and domestic happiness.",
        "jupiter_influence": "Jupiter in Gemini for most of the year supports intellectual pursuits, skill development, and positive relationships with siblings. Jupiter enters Cancer in December, bringing focus to home and family matters.",
        "saturn_influence": "Saturn in Pisces influences your 12th house, encouraging spiritual growth, foreign connections, and letting go of old patterns. This is a year for inner transformation.",
        "key_message": "This is your year to learn, grow, and build strong foundations. Balance ambition with patience, and don't be afraid to step out of your comfort zone."
      },
      "quarterly_predictions": {
        "Q1": {
          "summary": "The year starts with strong momentum. Jupiter's favorable position supports new learning and communication projects.",
          "focus": "Building skills, networking, short travels",
          "opportunities": [
            "New courses or certifications",
            "Writing or teaching opportunities",
            "Strengthening sibling relationships"
          ],
          "challenges": [
            "Managing multiple commitments",
            "Avoiding scattered energy"
          ]
        },
        "Q2": {
          "summary": "Mid-year brings focus to home, family, and emotional security. Property matters are favored.",
          "focus": "Home improvements, family relationships, emotional healing",
          "opportunities": [
            "Real estate investments",
            "Family reunions",
            "Creating peaceful home environment"
          ],
          "challenges": [
            "Balancing work and family time",
            "Managing family expectations"
          ]
        },
        "Q3": {
          "summary": "Autumn months support creativity, romance, and taking calculated risks. Express yourself confidently.",
          "focus": "Creative projects, romance, speculation",
          "opportunities": [
            "Creative collaborations",
            "Romantic developments",
            "Investment opportunities"
          ],
          "challenges": [
            "Avoiding overconfidence",
            "Managing financial risks"
          ]
        },
        "Q4": {
          "summary": "Year ends with Jupiter entering Cancer, emphasizing home and family. Perfect time for domestic happiness.",
          "focus": "Home, family, emotional well-being",
          "opportunities": [
            "Moving to a new home",
            "Family celebrations",
            "Creating lasting memories"
          ],
          "challenges": [
            "Year-end work pressure",
            "Managing multiple responsibilities"
          ]
        }
      },
      "career_business": {
        "summary": "Career prospects look promising throughout 2025. Your communication skills and leadership abilities will be recognized. Opportunities for learning new skills and taking on challenging projects are abundant.",
        "opportunities": [
          "Promotions in Q2 and Q3",
          "Leadership roles",
          "International projects or collaborations",
          "Skill development programs",
          "Networking opportunities"
        ],
        "challenges": [
          "Managing increased responsibilities",
          "Work-life balance in Q3",
          "Delegation and team management"
        ],
        "best_months": [
          "March",
          "May",
          "September",
          "November"
        ],
        "advice": "Focus on building your expertise and communicating your ideas effectively. Don't hesitate to take on leadership roles when offered. Invest in professional development."
      },
      "love_relationships": {
        "summary": "2025 brings warmth and stability to romantic relationships. Singles may find meaningful connections through intellectual or educational settings.",
        "singles": "Best months for meeting someone special are February, May, August, and November. Look for connections through classes, workshops, or online learning platforms. Someone who stimulates your mind will catch your attention.",
        "committed": "Existing relationships deepen through shared learning experiences and home-related activities. Jupiter's influence helps you communicate better with your partner. Consider planning a course together or making home improvements as a couple.",
        "challenges": [
          "Balancing independence with togetherness",
          "Communication gaps in June-July",
          "Managing expectations in Q3"
        ],
        "best_months": [
          "February",
          "May",
          "August",
          "November",
          "December"
        ],
        "advice": "Prioritize quality time with loved ones. Express your feelings clearly and listen actively to your partner's needs. Home-based date nights can be especially meaningful."
      },
      "health_wellness": {
        "summary": "Overall health remains good with some periods requiring extra attention to stress management and work-life balance.",
        "focus_areas": [
          "Mental health and stress management",
          "Regular exercise routine",
          "Digestive health",
          "Sleep quality",
          "Work-life balance"
        ],
        "vulnerable_periods": [
          "June-July: Watch for stress-related issues",
          "October: Energy levels may dip",
          "Monitor nervous system health throughout the year"
        ],
        "recommended_practices": [
          "Daily meditation or mindfulness practice",
          "Regular yoga or stretching",
          "Outdoor activities and nature walks",
          "Adequate sleep (7-8 hours)",
          "Balanced diet with emphasis on fresh foods",
          "Limit caffeine and processed foods"
        ],
        "advice": "Listen to your body and don't ignore minor health issues. Preventive care is important. Consider regular health check-ups in March and September."
      },
      "finance_wealth": {
        "summary": "Financial situation shows steady growth with opportunities for increasing income through multiple sources. Saturn's influence suggests careful planning and disciplined saving.",
        "opportunities": [
          "Salary increases or bonuses",
          "Additional income from skills or teaching",
          "Real estate investments (especially Q2)",
          "Long-term investment growth",
          "Business expansion opportunities"
        ],
        "best_investments": [
          "Real estate (Q2-Q3)",
          "Education and skill development",
          "Technology and communication sector stocks",
          "Long-term mutual funds",
          "Gold (traditional hedge)"
        ],
        "best_months": [
          "January",
          "April",
          "September",
          "December"
        ],
        "cautions": [
          "Avoid impulsive investments in Q3",
          "Watch spending on luxury items in August",
          "Review contracts carefully before signing",
          "Don't over-leverage in property deals"
        ],
        "advice": "Create a comprehensive financial plan for the year. Set aside 20% of income for savings and investments. Diversify your investment portfolio. Seek professional financial advice for major decisions."
      },
      "spiritual_growth": {
        "summary": "Saturn in 12th house makes this an excellent year for spiritual development and inner transformation. You'll feel drawn to deeper questions about life and purpose.",
        "focus": [
          "Meditation and mindfulness practices",
          "Dream work and subconscious exploration",
          "Charitable activities and service",
          "Letting go of old patterns",
          "Connecting with spiritual teachers or communities"
        ],
        "benefits": "Spiritual practices will provide clarity, peace, and resilience. They'll help you navigate challenges with equanimity and make decisions aligned with your higher purpose.",
        "practices": [
          "Daily meditation (even 10 minutes)",
          "Journaling and self-reflection",
          "Yoga or tai chi",
          "Reading spiritual or philosophical texts",
          "Spending time in nature",
          "Volunteering or charitable work",
          "Mantras or affirmations"
        ]
      },
      "major_themes": [
        "Communication and Learning: Expanding knowledge and skills",
        "Home and Family: Creating domestic harmony and stability",
        "Professional Growth: Leadership and recognition",
        "Spiritual Evolution: Inner transformation and letting go",
        "Relationship Deepening: Building meaningful connections",
        "Financial Planning: Long-term wealth building"
      ]
    },
    "best_months": [
      {
        "month": "March",
        "quarter": "Q1",
        "rating": 5,
        "reasons": [
          "Jupiter's favorable aspect",
          "Strong Mars energy",
          "Career opportunities abound"
        ],
        "best_for": [
          "Career moves",
          "Starting new projects",
          "Networking"
        ]
      },
      {
        "month": "May",
        "quarter": "Q2",
        "rating": 5,
        "reasons": [
          "Jupiter-Venus conjunction",
          "Home and family harmony",
          "Financial gains"
        ],
        "best_for": [
          "Real estate deals",
          "Family events",
          "Romantic relationships"
        ]
      },
      {
        "month": "September",
        "quarter": "Q3",
        "rating": 4,
        "reasons": [
          "Creative energy peaks",
          "Professional recognition",
          "Strong intuition"
        ],
        "best_for": [
          "Creative projects",
          "Career advancement",
          "Personal development"
        ]
      },
      {
        "month": "November",
        "quarter": "Q4",
        "rating": 4,
        "reasons": [
          "Jupiter's beneficial rays",
          "Social connections expand",
          "Financial opportunities"
        ],
        "best_for": [
          "Networking",
          "Investments",
          "Social events"
        ]
      }
    ],
    "challenging_periods": [
      {
        "period": "June 15 - July 15",
        "reason": "Mars-Saturn square creates obstacles and delays",
        "advice": "Practice patience, avoid confrontations, and focus on completing existing projects rather than starting new ones"
      },
      {
        "period": "August 20 - September 10",
        "reason": "Mercury retrograde in your 6th house",
        "advice": "Double-check health appointments, work communications, and daily routines. Back up important data"
      },
      {
        "period": "October 5 - October 25",
        "reason": "Solar eclipse effects in 7th house",
        "advice": "Be extra patient in relationships. Avoid making major relationship decisions during this period"
      }
    ]
  }
}
```

### Required Fields
- `success` ✅
- `zodiacSign` ✅
- `horoscope.sign` ✅
- `horoscope.year` ✅
- `horoscope.period` ✅
- `horoscope.predictions.overview.rating` ✅
- `horoscope.predictions.overview.summary` ✅

---

## 5. Compatibility API

### Endpoint
```
GET /compatibility?sign1={zodiacSign1}&sign2={zodiacSign2}
```

### Parameters
- `sign1` (query parameter): First zodiac sign
- `sign2` (query parameter): Second zodiac sign

### Response Structure

```typescript
interface CompatibilityResponse {
  success: boolean;
  sign1: string;
  sign2: string;
  compatibility: {
    overall_score: number;          // 1-100
    love_score: number;             // 1-100
    friendship_score: number;       // 1-100
    business_score: number;         // 1-100
    summary: string;
    strengths: string[];
    challenges: string[];
    advice: string;
  };
}
```

### Example Response
```json
{
  "success": true,
  "sign1": "Cancer",
  "sign2": "Pisces",
  "compatibility": {
    "overall_score": 92,
    "love_score": 95,
    "friendship_score": 88,
    "business_score": 85,
    "summary": "Cancer and Pisces share an exceptional emotional bond. Both water signs understand each other's depth of feeling and intuitive nature.",
    "strengths": [
      "Deep emotional connection",
      "Mutual understanding and empathy",
      "Strong intuitive bond",
      "Shared values and goals"
    ],
    "challenges": [
      "Both can be overly emotional at times",
      "May avoid confronting issues",
      "Need to balance sensitivity with practicality"
    ],
    "advice": "Focus on open communication and maintain individual identities while nurturing your deep connection."
  }
}
```

---

## 6. Common Structures

### PlanetTransit
```typescript
interface PlanetTransit {
  longitude: number;          // Planetary longitude in degrees (0-360)
  latitude: number;           // Planetary latitude
  speed: number;              // Daily motion in degrees
  sign: string;               // Zodiac sign the planet is in
  degree: number;             // Degree within the sign (0-30)
  nakshatra: {
    name: string;             // Name of nakshatra
    number: number;           // Nakshatra number (1-27)
    pada: number;             // Pada number (1-4)
    lord: string;             // Ruling planet of nakshatra
  };
  is_retrograde: boolean;     // Whether planet is in retrograde motion
}
```

---

## 7. Frontend Consumption Guide

### Data Fetching Strategy
The frontend component uses React's `useEffect` hook to fetch horoscope data whenever the active tab changes:

```typescript
useEffect(() => {
  const fetchHoroscope = async () => {
    switch (activeTab) {
      case 'today':
        data = await getDailyHoroscope(zodiacSign);
        break;
      case 'weekly':
        data = await getWeeklyHoroscope(zodiacSign);
        break;
      case 'monthly':
        data = await getMonthlyHoroscope(zodiacSign);
        break;
      case 'yearly':
        data = await getYearlyHoroscope(zodiacSign);
        break;
    }
  };
  
  fetchHoroscope();
}, [activeTab]);
```

### Null Safety
All data access uses a helper function that returns `"--"` for missing values:

```typescript
const getValue = (value: any, fallback: string = '--'): string => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};
```

### Date Display Logic
The component intelligently displays dates based on the period:
- **Daily**: Shows `horoscope.date`
- **Weekly**: Shows `horoscope.start_date - horoscope.end_date`
- **Monthly**: Shows `horoscope.month`
- **Yearly**: Shows `horoscope.year`

### Lucky Elements Mapping
The component dynamically builds lucky elements from the API response:
- Number: `lucky_elements.number`
- Color: `lucky_elements.color` or first item in `lucky_elements.colors[]`
- Time: `lucky_elements.time`
- Direction: `lucky_elements.direction`
- Gemstone: `lucky_elements.gemstone` (if available)

### Prediction Categories
The component maps predictions to display cards:
- Uses `overall` or `overview` for the first card
- Maps `career`, `love`, `health`, `finance` to respective cards
- Each card shows:
  - Title and icon
  - Rating (stars) if available
  - Prediction text (uses `.prediction` or `.summary` field)

### Loading States
```typescript
if (loading) {
  return <LoadingSpinner />;
}
```

### Error Handling
```typescript
if (error) {
  return <ErrorMessage error={error} onRetry={reload} />;
}
```

---

## Important Notes for Backend Developers

**🔴 CRITICAL: This documentation is based on ACTUAL API responses currently being returned by the backend.**

### Response Format Requirements

1. **Exact Field Names**: The frontend expects the exact field names shown in the examples:
   - `predictions.overall` (not `predictions.overview` for daily)
   - `predictions.career`, `predictions.love`, `predictions.health`, `predictions.finance`
   - `lucky_elements.color`, `lucky_elements.colors`, `lucky_elements.number`, etc.
   - `remedies` array with specific fields

2. **Transit Strengths**: Use these exact values:
   - `"Highly Beneficial"`
   - `"Beneficial"`
   - `"Challenging"`
   - `"Neutral"`

3. **Ratings**: All rating fields must be numbers between 1-5

4. **Required vs Optional**: Based on actual API responses:
   - **Always Required**:
     - `success`, `zodiacSign`, `horoscope.sign`, `horoscope.period`
     - `horoscope.predictions.overall/overview`
     - At least one prediction category (career/love/health/finance)
   
   - **Optional but Recommended**:
     - `moon_phase`, `sign_lord`, `lord_position`
     - `transits`, `transit_strengths`
     - `lucky_elements` (highly valued by users)
     - `remedies` (important for user engagement)

5. **Date Formats**:
   - Daily: `"YYYY-MM-DD"` (e.g., "2025-12-12")
   - Weekly: `start_date` and `end_date` in `"YYYY-MM-DD"` format
   - Monthly: `month` as `"Month YYYY"` (e.g., "December 2025")
   - Yearly: `year` as number (e.g., 2025)

6. **Transit Structure**: The actual API returns complete planetary data including:
   - Longitude, latitude, speed
   - Sign, degree
   - Nakshatra details (name, number, pada, lord)
   - Retrograde status

7. **Days Breakdown** (Weekly): Each day should have:
   - `date`: ISO format date
   - `day_lord`: Ruling planet name
   - `quality`: Quality descriptor (e.g., "Excellent", "Good", "Average", "Moderate")
   - `focus`: Focus area for the day

8. **Quarterly Structure** (Yearly): Use format:
   - `"Q1_Jan_Mar"`, `"Q2_Apr_Jun"`, `"Q3_Jul_Sep"`, `"Q4_Oct_Dec"`
   - Each quarter has `summary`, `focus`, `opportunities[]`, `challenges[]`

### Frontend Display Sections

The frontend automatically generates 9 sections from the API response:

1. **Overview**: From `predictions.overall` or `predictions.overview`
2. **Love & Relationships**: From `predictions.love` with extended details
3. **Personal Life**: Derived from overall emotional factors
4. **Career & Finance**: Combined from `predictions.career` and `predictions.finance`
5. **Health & Wellness**: From `predictions.health`
6. **Emotions & Mind**: Derived from `moon_phase`, `sign_lord`, and overall factors
7. **Lucky Insights**: From `lucky_elements` object
8. **Travel & Movement**: Uses `lucky_elements.direction` and transit data
9. **Remedies**: From `remedies[]` array

### Lucky Elements Display

The frontend displays lucky elements with enhanced gradients and animations:
- **Lucky Number**: Purple-pink gradient with 🔢 icon
- **Lucky Color**: Pink-rose gradient with 🎨 icon
- **Lucky Time**: Blue-cyan gradient with ⏰ icon
- **Lucky Direction**: Green-emerald gradient with 🧭 icon
- **Lucky Gemstone**: Amber-orange gradient with 💎 icon
- **Day Quality**: Yellow gradient with ✨ icon

Ensure all these fields are populated for best user experience.

---

## Testing Checklist

When implementing these APIs, ensure:

- [ ] All 4 endpoints return correct period-specific structures
- [ ] Required fields are always present
- [ ] Ratings are between 1-5
- [ ] Date formats are consistent
- [ ] null/undefined values are handled (or avoided)
- [ ] Error responses follow the error format
- [ ] All 12 zodiac signs are supported
- [ ] Response times are reasonable (<2 seconds)
- [ ] Transit data follows PlanetTransit structure when provided
- [ ] Text fields contain meaningful content (no empty strings)
- [ ] Arrays are properly formatted (even if empty)
- [ ] Predictions object contains all 5 categories where applicable

---

## Summary

This documentation provides complete specifications for all 4 horoscope API endpoints. The frontend is designed to be fully dynamic, consuming all data from these APIs without any hardcoded content. When data is unavailable, the frontend displays `"--"` as a fallback, ensuring a consistent user experience regardless of data completeness.

For questions or clarifications, please contact the frontend development team.
