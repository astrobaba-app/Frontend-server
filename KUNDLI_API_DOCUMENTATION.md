# Kundli Report API Documentation

## Overview

This document provides the complete API response format expected by the frontend for the Kundli Report module. The frontend expects data from the `getKundli` API endpoint which returns a comprehensive kundli report for a user.

**Base API Endpoint:** `GET /kundli/{userRequestId}`

**Response Structure:**
```json
{
  "success": boolean,
  "kundli": { /* KundliData object */ }
}
```

---

## Complete Response Format

### Root Level Structure

```typescript
interface KundliResponse {
  success: boolean;
  kundli: {
    id: string;                    // Unique identifier for the kundli
    requestId: string;              // Reference to user request ID
    basicDetails: BasicDetails;     // Core birth details
    astroDetails: AstroDetails;     // House cusps and advanced astro data
    manglikAnalysis: ManglikAnalysis; // Manglik dosha analysis
    panchang: Panchang;             // Panchang data
    charts: Charts;                 // All divisional charts (D1-D60)
    dasha: DashaData;               // Vimshottari Dasha with nested levels
    yogini: YoginiData;             // Yogini Dasha with nested levels
    personality: Personality;       // Personality reports and analysis
    planetary: PlanetaryData;       // Planetary positions and details
    remedies: Remedies;             // Gemstone and Rudraksha recommendations
    yogas?: Yoga[];                 // OPTIONAL: Astrological yogas
    ashtakvarga?: Ashtakvarga;      // OPTIONAL: Ashtakvarga charts
    kalsarpaData?: KalsarpaData;    // OPTIONAL: Kalsarpa dosha analysis
    sadesatiData?: SadesatiData;    // OPTIONAL: Sadesati analysis
    createdAt: string;              // ISO 8601 timestamp
    updatedAt: string;              // ISO 8601 timestamp
    userRequest: UserRequest;       // Original user request data
  };
}
```

---

## 1. Basic Details Tab

The Basic Details tab displays core birth information, planetary positions, panchang, and remedies.

### Data Structure

#### BasicDetails
```typescript
interface BasicDetails {
  ascendant: {
    longitude: number;    // Ascendant longitude in degrees (0-360)
    sign: string;         // Zodiac sign (e.g., "Virgo", "Aries")
    degree: number;       // Degree within the sign (0-30)
  };
  sun_sign: string;       // Sun sign (e.g., "Aquarius")
  moon_sign: string;      // Moon sign (e.g., "Aries")
  birth_nakshatra?: string; // OPTIONAL: Birth nakshatra name
}
```

#### Example Response
```json
{
  "basicDetails": {
    "ascendant": {
      "longitude": 161.319935,
      "sign": "Virgo",
      "degree": 11.319935
    },
    "sun_sign": "Aquarius",
    "moon_sign": "Aries",
    "birth_nakshatra": "Ashwini"
  }
}
```

### Fields Used in UI

| Field | Required | Data Type | Description |
|-------|----------|-----------|-------------|
| `ascendant.sign` | Yes | string | Displayed as "Ascendant" |
| `ascendant.longitude` | Yes | number | Used for calculations |
| `ascendant.degree` | Yes | number | Displayed in planetary table |
| `sun_sign` | Yes | string | Displayed as "Sun Sign" |
| `moon_sign` | Yes | string | Displayed as "Moon Sign" |
| `birth_nakshatra` | No | string | Birth nakshatra (from panchang if not here) |

**Note:** If `birth_nakshatra` is not in `basicDetails`, the frontend will use `panchang.nakshatra.name`.

---

## 2. Kundli Tab

The Kundli tab displays planetary positions, charts (D1, D9), and detailed planetary table.

### Data Structure

#### PlanetaryData
```typescript
interface PlanetaryData {
  [planetName: string]: {
    planet: string;           // Planet name (e.g., "Sun", "Moon", "Mars")
    longitude: number;        // Longitude in degrees (0-360)
    sign: string;             // Zodiac sign
    sign_num: number;         // Sign number (0-11, Aries=0, Pisces=11)
    sign_degree: number;      // Degree within the sign (0-30)
    degrees: number;          // Integer degrees
    minutes: number;          // Integer minutes
    seconds: number;          // Seconds with decimals
    nakshatra: string;        // Nakshatra name
    nakshatra_num: number;    // Nakshatra number (0-26)
    nakshatra_pada: number;   // Pada (1-4)
    is_retrograde: boolean;   // Retrograde status
    house?: number;           // OPTIONAL: House number (1-12)
    consideration?: string;   // OPTIONAL: Planetary consideration text
    description?: string;     // OPTIONAL: Planetary description
  };
}
```

#### Example Response
```json
{
  "planetary": {
    "Sun": {
      "planet": "Sun",
      "longitude": 319.201704,
      "sign": "Aquarius",
      "sign_num": 10,
      "sign_degree": 19.201704,
      "degrees": 319,
      "minutes": 12,
      "seconds": 6.14,
      "nakshatra": "Shatabhisha",
      "nakshatra_num": 23,
      "nakshatra_pada": 4,
      "is_retrograde": false
    },
    "Moon": {
      "planet": "Moon",
      "longitude": 10.337265,
      "sign": "Aries",
      "sign_num": 0,
      "sign_degree": 10.337265,
      "degrees": 10,
      "minutes": 20,
      "seconds": 14.15,
      "nakshatra": "Ashwini",
      "nakshatra_num": 0,
      "nakshatra_pada": 4,
      "is_retrograde": false
    }
    // ... other planets (Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
  }
}
```

### Planets Required

Must include all 9 planets:
- **Sun**
- **Moon**
- **Mars**
- **Mercury**
- **Jupiter**
- **Venus**
- **Saturn**
- **Rahu**
- **Ketu**

### Planetary Table Columns

The frontend displays the following columns:

| Column | Data Source | Description |
|--------|-------------|-------------|
| Planet | `planet` | Planet name |
| Sign | `sign` | Zodiac sign |
| Sign Lord | Calculated | Based on sign (frontend logic) |
| Degree | `sign_degree` | Degree within sign (formatted as "19.20°") |
| Nakshatra | `nakshatra` | Nakshatra name |
| Nakshatra Lord | Calculated | Based on nakshatra (frontend logic) |
| House | `house` OR calculated | House number (1-12) |
| Retro | `is_retrograde` | "Retro" or "Direct" |
| Status | Calculated | "Exalted", "Debilitated", "Own Sign", or "Neutral" |

---

## 3. Charts Tab

The Charts tab displays all divisional charts (D1 to D60) plus special charts (Chalit, Sun, Moon).

### Data Structure

#### Charts
```typescript
interface Charts {
  D1: ChartData;    // Rashi / Lagna chart (REQUIRED)
  D2: ChartData;    // Hora chart
  D3: ChartData;    // Drekkana chart
  D4: ChartData;    // Chaturthamsa chart
  D7: ChartData;    // Saptamsa chart
  D9: ChartData;    // Navamsa chart (REQUIRED)
  D10: ChartData;   // Dasamsa chart
  D12: ChartData;   // Dwadasamsa chart
  D16: ChartData;   // Shodasamsa chart
  D20: ChartData;   // Vimsamsa chart
  D24: ChartData;   // Chaturvimsamsa chart
  D27: ChartData;   // Saptavimsamsa chart
  D30: ChartData;   // Trimsamsa chart
  D40: ChartData;   // Khavedamsa chart
  D45: ChartData;   // Akshavedamsa chart
  D60: ChartData;   // Shashtiamsa chart
}

interface ChartData {
  division: string;       // Chart code (e.g., "D1", "D9")
  name: string;           // Chart name (e.g., "Rashi", "Navamsa")
  matters: string;        // What the chart represents
  planets: {
    [planetName: string]: {
      original_longitude: number;  // Original longitude before division
      sign: string;                // Sign in this divisional chart
      sign_num: number;            // Sign number (0-11)
      degree: number;              // Degree within sign
      longitude: number;           // Adjusted longitude for this division
    };
  };
}
```

#### Example Response
```json
{
  "charts": {
    "D1": {
      "division": "D1",
      "name": "Rashi",
      "matters": "Body, overall life",
      "planets": {
        "Sun": {
          "original_longitude": 319.201704,
          "sign": "Aquarius",
          "sign_num": 10,
          "degree": 19.201704,
          "longitude": 319.201704
        },
        "Moon": {
          "original_longitude": 10.337265,
          "sign": "Aries",
          "sign_num": 0,
          "degree": 10.337265,
          "longitude": 10.337265
        }
        // ... all other planets
      }
    },
    "D9": {
      "division": "D9",
      "name": "Navamsa",
      "matters": "Marriage, dharma",
      "planets": {
        "Sun": {
          "original_longitude": 319.201704,
          "sign": "Pisces",
          "sign_num": 11,
          "degree": 22.815336,
          "longitude": 352.815336
        }
        // ... all other planets
      }
    }
    // ... D2, D3, D4, D7, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60
  }
}
```

### Chart Descriptions

| Chart | Division | Name | Matters |
|-------|----------|------|---------|
| D1 | D1 | Rashi | Body, overall life |
| D2 | D2 | Hora | Wealth |
| D3 | D3 | Drekkana | Siblings, courage |
| D4 | D4 | Chaturthamsa | Fortune, property |
| D7 | D7 | Saptamsa | Children, creativity |
| D9 | D9 | Navamsa | Marriage, dharma |
| D10 | D10 | Dasamsa | Career, profession |
| D12 | D12 | Dwadasamsa | Parents |
| D16 | D16 | Shodasamsa | Vehicles, luxuries |
| D20 | D20 | Vimsamsa | Spiritual progress |
| D24 | D24 | Chaturvimsamsa | Learning, education |
| D27 | D27 | Saptavimsamsa | Strengths, weaknesses |
| D30 | D30 | Trimsamsa | Evils, misfortunes |
| D40 | D40 | Khavedamsa | Maternal heritage |
| D45 | D45 | Akshavedamsa | Paternal heritage |
| D60 | D60 | Shashtiamsa | Past life, karma |

**Note:** The frontend will also generate **Chalit**, **Sun**, and **Moon** charts dynamically using D1 data.

---

## 4. KP Tab

The KP Tab displays KP system charts and tables including Bhav Chalit chart, ruling planets, KP planet table, and cuspal details.

### Data Structure

#### AstroDetails
```typescript
interface AstroDetails {
  houses: {
    cusps: number[];              // Array of 12 house cusp longitudes (degrees)
    ascendant: number;            // Ascendant longitude
    mc: number;                   // Midheaven (MC) longitude
    armc: number;                 // ARMC value
    vertex: number;               // Vertex point
    equatorial_ascendant: number; // Equatorial ascendant
    co_ascendant_koch: number;    // Co-ascendant (Koch)
    polar_ascendant: number;      // Polar ascendant
    house_system: string;         // House system used (e.g., "PLACIDUS")
  };
  ascendant: {
    longitude: number;
    sign: string;
    degree: number;
  };
}
```

#### Example Response
```json
{
  "astroDetails": {
    "houses": {
      "cusps": [
        161.319935,  // House 1
        193.871822,  // House 2
        225.231127,  // House 3
        254.113605,  // House 4
        281.743419,  // House 5
        310.317936,  // House 6
        341.319935,  // House 7
        13.871822,   // House 8
        45.231127,   // House 9
        74.113605,   // House 10
        101.743419,  // House 11
        130.317936   // House 12
      ],
      "ascendant": 161.319935,
      "mc": 74.113605,
      "armc": 72.766307,
      "vertex": 0,
      "equatorial_ascendant": 161.319935,
      "co_ascendant_koch": 161.319935,
      "polar_ascendant": 180,
      "house_system": "PLACIDUS"
    },
    "ascendant": {
      "longitude": 161.319935,
      "sign": "Virgo",
      "degree": 11.319935
    }
  }
}
```

### KP Planet Table

The frontend calculates the following for each planet:

| Column | Data Source | Description |
|--------|-------------|-------------|
| Name | `planetary[planet].planet` | Planet name |
| Cusp | Calculated | House number based on ascendant |
| Sign | `planetary[planet].sign` | Zodiac sign |
| Sign Lord | Calculated | Based on sign |
| Star Lord | Calculated | Based on nakshatra |
| Sub Lord | Backend (if available) | KP sub-lord (requires specialized calculation) |

### Cuspal Details Table

| Column | Data Source | Description |
|--------|-------------|-------------|
| Cusp | Index + 1 | House number (1-12) |
| Degree | `astroDetails.houses.cusps[index]` | Cusp longitude |
| Sign | Calculated | Sign from longitude |
| Sign Lord | Calculated | Based on sign |
| Star Lord | Calculated | Based on nakshatra |
| Sub Lord | Backend (if available) | KP sub-lord |

### Ruling Planets

Displays ruling planets for:
- **Mo** (Moon)
- **Asc** (Ascendant)
- **Day** (Day of birth)

**Columns:** Sign Lord, Star Lord, Sub Lord

---

## 5. Dasha Tab

The Dasha tab displays Vimshottari and Yogini dasha systems with nested sub-dashas (up to 4 levels).

### Data Structure

#### DashaData
```typescript
interface DashaData {
  system: string;              // "Vimshottari"
  birth_nakshatra: string;     // Birth nakshatra
  birth_nakshatra_lord: string; // Nakshatra lord
  balance_at_birth: string;    // Balance percentage (e.g., "22.47%")
  dashas: DashaPeriod[];       // Array of Mahadasha periods
}

interface DashaPeriod {
  planet: string;              // Planet name
  start_date: string;          // Start date (YYYY-MM-DD)
  end_date: string;            // End date (YYYY-MM-DD)
  years: number;               // Duration in years
  is_balance: boolean;         // Is this the balance period?
  description?: string;        // OPTIONAL: Mahadasha description
  sign?: string;               // OPTIONAL: Planet sign
  house?: number;              // OPTIONAL: Planet house
  sub_dashas?: DashaPeriod[];  // OPTIONAL: Array of Antardasha periods
}
```

#### Nested Structure (4 Levels)

```
Mahadasha (Main period)
  └── sub_dashas: Antardasha
       └── sub_dashas: Pratyantardasha
            └── sub_dashas: Sookshma dasha
```

#### Example Response
```json
{
  "dasha": {
    "system": "Vimshottari",
    "birth_nakshatra": "Ashwini",
    "birth_nakshatra_lord": "Ketu",
    "balance_at_birth": "22.47%",
    "dashas": [
      {
        "planet": "Ketu",
        "start_date": "2025-03-03",
        "end_date": "2026-09-29",
        "years": 1.57,
        "is_balance": true,
        "description": "Ketu Mahadasha brings spiritual insights and detachment...",
        "sub_dashas": [
          {
            "planet": "Ketu",
            "start_date": "2025-03-03",
            "end_date": "2025-07-01",
            "years": 0.33,
            "sub_dashas": [
              {
                "planet": "Ketu",
                "start_date": "2025-03-03",
                "end_date": "2025-03-17",
                "years": 0.04,
                "sub_dashas": [
                  {
                    "planet": "Ketu",
                    "start_date": "2025-03-03",
                    "end_date": "2025-03-05",
                    "years": 0.005
                  }
                  // ... other Sookshma periods
                ]
              }
              // ... other Pratyantardasha periods
            ]
          }
          // ... other Antardasha periods
        ]
      },
      {
        "planet": "Venus",
        "start_date": "2026-09-29",
        "end_date": "2046-09-29",
        "years": 20,
        "is_balance": false,
        "description": "Venus Mahadasha brings love, luxury, and artistic talents...",
        "sub_dashas": [ /* ... */ ]
      }
      // ... other Mahadasha periods
    ]
  }
}
```

#### YoginiData
```typescript
interface YoginiData {
  system: string;              // "Yogini" or "Vimshottari"
  birth_nakshatra: string;
  birth_nakshatra_lord: string;
  balance_at_birth: string;
  dashas: DashaPeriod[];       // Same structure as Vimshottari
}
```

**Note:** Yogini dasha uses the same nested structure as Vimshottari dasha.

### UI Behavior

- Displays Mahadasha periods by default
- Clicking on a period with `sub_dashas` shows Antardasha
- Clicking on Antardasha shows Pratyantardasha
- Clicking on Pratyantardasha shows Sookshma dasha
- Breadcrumb navigation allows going back to previous levels
- Only periods with non-empty `sub_dashas` array show the right arrow

---

## 6. Ashtakvarga Tab (OPTIONAL)

The Ashtakvarga tab displays Ashtakvarga charts for all planets and Sarvashtakvarga (SAV).

### Data Structure

#### Ashtakvarga
```typescript
interface Ashtakvarga {
  sav: number[];           // Sarvashtakvarga values (12 houses)
  asc: number[];           // Ascendant ashtakvarga (12 houses)
  jupiter: number[];       // Jupiter ashtakvarga (12 houses)
  mars: number[];          // Mars ashtakvarga (12 houses)
  mercury: number[];       // Mercury ashtakvarga (12 houses)
  moon: number[];          // Moon ashtakvarga (12 houses)
  saturn: number[];        // Saturn ashtakvarga (12 houses)
  sun: number[];           // Sun ashtakvarga (12 houses)
  venus: number[];         // Venus ashtakvarga (12 houses)
}
```

#### Example Response
```json
{
  "ashtakvarga": {
    "sav": [28, 32, 29, 25, 31, 27, 30, 26, 33, 29, 28, 30],
    "asc": [4, 5, 3, 2, 4, 3, 4, 3, 5, 4, 3, 4],
    "jupiter": [5, 6, 4, 3, 5, 4, 5, 4, 6, 5, 4, 5],
    "mars": [3, 4, 3, 2, 4, 3, 3, 2, 4, 3, 3, 4],
    "mercury": [4, 5, 4, 3, 5, 4, 4, 3, 5, 4, 4, 5],
    "moon": [4, 5, 4, 3, 5, 4, 4, 3, 5, 4, 4, 5],
    "saturn": [3, 4, 3, 2, 4, 3, 3, 2, 4, 3, 3, 4],
    "sun": [3, 2, 4, 5, 2, 3, 4, 5, 2, 3, 4, 2],
    "venus": [2, 1, 4, 5, 2, 3, 3, 4, 2, 3, 3, 1]
  }
}
```

**Note:** Each array contains 12 numbers representing the bindus (points) for each house (1-12).

---

## 7. Free Report Tab

The Free Report tab has 3 main sections: General, Remedies, and Dosha.

### 7.1 General Section (Sub-tabs)

#### General Sub-tab

Uses `personality.asc_report` and `personality` fields:

```typescript
interface Personality {
  ascendant_sign: string;
  ascendant_degree: number;
  description: string;
  asc_report?: {
    ascendant: string;          // Ascendant sign
    description: string;        // Ascendant description
    report: string;             // Personality report
  };
  personality_report?: string;  // General personality text
  physical_characteristics?: string;  // Physical traits
  health_report?: string;       // Health analysis
}
```

#### Example Response
```json
{
  "personality": {
    "ascendant_sign": "Virgo",
    "ascendant_degree": 161.319935,
    "description": "Ascendant in Virgo",
    "asc_report": {
      "ascendant": "Virgo",
      "description": "Your ascendant is Virgo, which makes you analytical...",
      "report": "People with Virgo ascendant are known for their attention to detail..."
    },
    "personality_report": "You have a practical and methodical approach to life...",
    "physical_characteristics": "Medium height, well-proportioned body...",
    "health_report": "Generally good health but prone to digestive issues..."
  }
}
```

#### Planetary Sub-tab

Uses `planetary` array with `consideration` or `description` fields:

```typescript
// If planetary is an array
interface PlanetaryArray {
  name: string;
  sign: string;
  house: number;
  consideration?: string;   // Planetary consideration text
  description?: string;     // Alternative to consideration
}
```

#### Vimshottari Dasha Sub-tab

Uses `dasha.dashas[].description` field (already documented in section 5).

#### Yoga Sub-tab

Uses `yogas` array:

```typescript
interface Yoga {
  name: string;           // Yoga name
  condition?: string;     // Yoga condition/subtitle
  subtitle?: string;      // Alternative subtitle
  description: string;    // Yoga description
}
```

#### Example Response
```json
{
  "yogas": [
    {
      "name": "Gajakesari Yoga",
      "condition": "Jupiter in Kendra from Moon",
      "description": "This yoga brings wisdom, knowledge, and fame. The native will be respected in society..."
    },
    {
      "name": "Budha-Aditya Yoga",
      "subtitle": "Sun and Mercury conjunction",
      "description": "This yoga enhances intelligence and communication skills..."
    }
  ]
}
```

### 7.2 Remedies Section

#### Rudraksha Tab

```typescript
interface Rudraksha {
  suggested: string | string[];     // Suggested Rudraksha(s) (e.g., "4-Mukhi", ["4-Mukhi", "5-Mukhi"])
  suggestion_report?: string;       // Main suggestion report text
  importance?: string;              // Importance of Rudraksha
  additional_info?: string;         // Additional information
  recommendation?: string;          // Specific recommendation for user
  mukhi_details?: {
    [mukhiType: string]: {          // e.g., "4-Mukhi", "5-Mukhi"
      details: string;              // Detailed description
      benefits: string[];           // Array of benefits
      how_to_wear: string;          // How to wear instructions
      precautions: string[];        // Array of precautions
    };
  };
}
```

#### Example Response
```json
{
  "remedies": {
    "rudraksha": {
      "suggested": ["4-Mukhi", "5-Mukhi"],
      "suggestion_report": "This Rudraksha suggestion report aims to help you choose...",
      "importance": "Rudraksha beads are produced by the 'Rudraksha Tree'...",
      "recommendation": "Having been born in the Ashwini nakshatra, the most suitable...",
      "mukhi_details": {
        "4-Mukhi": {
          "details": "A 4-Mukhi Rudraksha holds the blessing of Lord Brahma...",
          "benefits": [
            "Enhances self-expression and personality",
            "Helps control stammering and speech issues",
            "Develops intelligence and sense of duty"
          ],
          "how_to_wear": "The best day to wear is Thursday morning...",
          "precautions": [
            "Worship the bead daily",
            "Don't wear broken beads",
            "Remove before sleeping"
          ]
        },
        "5-Mukhi": {
          "details": "One of the most well-known rudrakshas...",
          "benefits": [
            "Safeguards from accidents",
            "Increases courage",
            "Ensures mental tranquility"
          ],
          "how_to_wear": "The best day to wear is Thursday...",
          "precautions": [
            "Worship it daily",
            "Never show it off to others"
          ]
        }
      }
    }
  }
}
```

#### Gemstones Tab

```typescript
interface Gemstones {
  primary?: string;              // OPTIONAL: Primary gemstone name
  secondary?: string;            // OPTIONAL: Secondary gemstone name
  description?: string;          // OPTIONAL: General description
  life_stone?: GemstoneDetail;   // Life stone details
  lucky_stone?: GemstoneDetail;  // Lucky stone details
  fortune_stone?: GemstoneDetail; // Fortune stone details
}

interface GemstoneDetail {
  title: string;             // Title (e.g., "Life stone for Virgo")
  description: string;       // Detailed description
  stone_name: string;        // Gemstone name (e.g., "Red Coral")
  how_to_wear: string;       // Wearing instructions
  mantra: string;            // Mantra to chant
}
```

#### Example Response
```json
{
  "remedies": {
    "gemstones": {
      "primary": "Ruby",
      "secondary": "Pearl",
      "description": "Based on planetary positions",
      "life_stone": {
        "title": "Life stone for Virgo (Kanya Lagna)",
        "description": "A life stone is a gem for the Lagna lord...",
        "stone_name": "Emerald (Panna)",
        "how_to_wear": "With Gold ring, on little finger",
        "mantra": "Om bram brim braum sah budhaya namah"
      },
      "lucky_stone": {
        "title": "Lucky Gemstone for Virgo",
        "description": "A lucky gemstone is worn to enhance luck...",
        "stone_name": "Blue Sapphire (Neelam)",
        "how_to_wear": "With Silver ring, on middle finger",
        "mantra": "Om pram prim praum sah shanaye namah"
      },
      "fortune_stone": {
        "title": "Fortune Stone for Virgo",
        "description": "The Bhagya stone helps attract fortune...",
        "stone_name": "Yellow Sapphire (Pukhraj)",
        "how_to_wear": "With Gold ring, on index finger",
        "mantra": "Om gram grim graum sah gurave namah"
      }
    }
  }
}
```

### 7.3 Dosha Section

#### Manglik Dosha

```typescript
interface ManglikAnalysis {
  is_manglik: boolean;       // Is the person Manglik?
  mangal_dosha: string | null; // Mangal dosha type (if any)
  all_doshas: string[];      // Array of all doshas
  description: string;       // Description of Manglik status
}
```

#### Example Response
```json
{
  "manglikAnalysis": {
    "is_manglik": false,
    "mangal_dosha": null,
    "all_doshas": [],
    "description": "No Mangal Dosha detected"
  }
}
```

#### Kalsarpa Dosha (OPTIONAL)

```typescript
interface KalsarpaData {
  is_kalsarpa: boolean;      // Is Kalsarpa dosha present?
  type?: string;             // Type of Kalsarpa dosha
  description: string;       // Description
}
```

#### Example Response
```json
{
  "kalsarpaData": {
    "is_kalsarpa": true,
    "type": "Anant Kalsarpa",
    "description": "Anant Kalsarpa Yoga is formed when Rahu is in the first house..."
  }
}
```

#### Sadesati (OPTIONAL)

```typescript
interface SadesatiData {
  is_sadesati: boolean;              // Is Sadesati active?
  status: string;                    // Current status
  current_phase?: string;            // Current phase (Rising/Peak/Setting)
  periods?: SadesatiPeriod[];        // Array of Sadesati periods
  rising_phase_description?: string; // Rising phase description
  peak_phase_description?: string;   // Peak phase description
  setting_phase_description?: string; // Setting phase description
}

interface SadesatiPeriod {
  start_date: string;    // Start date (YYYY-MM-DD)
  end_date: string;      // End date (YYYY-MM-DD)
  sign_name: string;     // Sign name
  type: string;          // Type (Rising/Peak/Setting)
}
```

#### Example Response
```json
{
  "sadesatiData": {
    "is_sadesati": true,
    "status": "Currently in Sadesati period",
    "current_phase": "Peak Phase",
    "periods": [
      {
        "start_date": "2020-01-24",
        "end_date": "2022-04-29",
        "sign_name": "Capricorn",
        "type": "Rising Phase"
      },
      {
        "start_date": "2022-04-29",
        "end_date": "2025-03-29",
        "sign_name": "Aquarius",
        "type": "Peak Phase"
      },
      {
        "start_date": "2025-03-29",
        "end_date": "2027-07-12",
        "sign_name": "Pisces",
        "type": "Setting Phase"
      }
    ],
    "rising_phase_description": "The rising phase brings gradual challenges...",
    "peak_phase_description": "The peak phase is the most intense period...",
    "setting_phase_description": "The setting phase brings gradual relief..."
  }
}
```

---

## 8. Panchang Data

```typescript
interface Panchang {
  date: string;                 // Date (YYYY-MM-DD)
  weekday: string;              // Day of week (e.g., "Monday")
  sunrise: string;              // Sunrise time (HH:MM:SS)
  sunset: string;               // Sunset time (HH:MM:SS)
  tithi: {
    number: number;             // Tithi number (1-30)
    name: string;               // Tithi name (e.g., "Chaturthi")
    paksha: string;             // Paksha (Shukla/Krishna)
    progress_percent: number;   // Progress percentage
    elongation: number;         // Moon elongation
  };
  nakshatra: {
    number: number;             // Nakshatra number (1-27)
    name: string;               // Nakshatra name
    pada: number;               // Pada (1-4)
    lord: string;               // Nakshatra lord
    progress_percent: number;   // Progress percentage
  };
  yoga: {
    number: number;             // Yoga number
    name: string;               // Yoga name
    progress_percent: number;   // Progress percentage
  };
  karana: {
    number: number;             // Karana number
    name: string;               // Karana name
    progress_percent: number;   // Progress percentage
  };
  rahu_kaal: {
    start: string;              // Start time (HH:MM:SS)
    end: string;                // End time (HH:MM:SS)
    duration_minutes: number;   // Duration in minutes
  };
  gulika_kaal: {
    start: string;              // Start time
    end: string;                // End time
    duration_minutes: number;   // Duration in minutes
  };
  sun: {
    longitude: number;          // Sun longitude
    sign: string;               // Sun sign
    nakshatra: string;          // Sun nakshatra
  };
  moon: {
    longitude: number;          // Moon longitude
    sign: string;               // Moon sign
    nakshatra: string;          // Moon nakshatra
  };
}
```

---

## 9. User Request Data

```typescript
interface UserRequest {
  id: string;               // Request ID
  userId: string;           // User ID
  fullName: string;         // Full name
  dateOfbirth: string;      // Date of birth (ISO 8601)
  timeOfbirth: string;      // Time of birth (HH:MM)
  placeOfBirth: string;     // Place of birth
  gender: string;           // Gender (Male/Female/Other)
  latitude: number;         // Latitude
  longitude: number;        // Longitude
  createdAt: string;        // Created timestamp (ISO 8601)
  updatedAt: string;        // Updated timestamp (ISO 8601)
}
```

---

## Summary: Required vs Optional Fields

### Required Fields (Must be present)

- `basicDetails.ascendant` (longitude, sign, degree)
- `basicDetails.sun_sign`
- `basicDetails.moon_sign`
- `planetary` (all 9 planets with complete data)
- `charts.D1` (Rashi chart)
- `charts.D9` (Navamsa chart)
- `dasha` (Vimshottari dasha with at least Mahadasha periods)
- `personality` (ascendant_sign, description)
- `manglikAnalysis` (is_manglik, description)
- `panchang` (complete panchang data)
- `remedies` (basic gemstone and rudraksha data)
- `userRequest` (all user request fields)

### Optional Fields

- `basicDetails.birth_nakshatra`
- `planetary[planet].house`
- `planetary[planet].consideration`
- `planetary[planet].description`
- `charts.D2` through `D60` (all other divisional charts)
- `dasha.dashas[].description`
- `dasha.dashas[].sub_dashas` (nested dasha levels)
- `yogini` (Yogini dasha system)
- `personality.asc_report`
- `personality.personality_report`
- `personality.physical_characteristics`
- `personality.health_report`
- `remedies.rudraksha.mukhi_details`
- `remedies.gemstones` (detailed gemstone info)
- `yogas` (yoga array)
- `ashtakvarga` (all ashtakvarga charts)
- `kalsarpaData`
- `sadesatiData`
- `astroDetails` (house cusps - required for KP tab)

---

## Error Handling

When data is missing or null, the frontend displays:
- `"--"` for single values
- `"---"` for text descriptions
- `"No data available"` for tables/lists

---

## Date Format

All dates should be returned in **YYYY-MM-DD** format (ISO 8601 date).

The frontend will format them as:
- **DD-MM-YYYY** for display (e.g., "03-03-2025")
- **DD-Month-YYYY** for certain displays (e.g., "03 March 2025")

---

## Complete Example Response

See the JSON provided by the user at the beginning of this document for a complete working example. Additional fields required by the frontend but not in that example:

```json
{
  "kundli": {
    // ... existing fields ...
    "personality": {
      "ascendant_sign": "Virgo",
      "ascendant_degree": 161.319935,
      "description": "Ascendant in Virgo",
      "asc_report": {
        "ascendant": "Virgo",
        "description": "Your ascendant sign analysis...",
        "report": "Detailed personality report..."
      },
      "personality_report": "General personality description...",
      "physical_characteristics": "Physical traits description...",
      "health_report": "Health analysis..."
    },
    "dasha": {
      "system": "Vimshottari",
      "dashas": [
        {
          "planet": "Venus",
          "start_date": "2026-09-29",
          "end_date": "2046-09-29",
          "years": 20,
          "description": "Venus Mahadasha brings...",
          "sub_dashas": [
            {
              "planet": "Venus",
              "start_date": "2026-09-29",
              "end_date": "2029-09-28",
              "years": 3,
              "sub_dashas": [ /* ... */ ]
            }
          ]
        }
      ]
    },
    "yogas": [
      {
        "name": "Gajakesari Yoga",
        "condition": "Jupiter in Kendra from Moon",
        "description": "This yoga brings wisdom..."
      }
    ],
    "remedies": {
      "rudraksha": {
        "suggested": ["4-Mukhi", "5-Mukhi"],
        "mukhi_details": {
          "4-Mukhi": { /* ... */ },
          "5-Mukhi": { /* ... */ }
        }
      },
      "gemstones": {
        "life_stone": { /* ... */ },
        "lucky_stone": { /* ... */ },
        "fortune_stone": { /* ... */ }
      }
    },
    "kalsarpaData": { /* ... */ },
    "sadesatiData": { /* ... */ },
    "ashtakvarga": { /* ... */ }
  }
}
```

---

## Notes for Backend Developers

1. **Nested Dasha Structure:** Ensure sub-dashas are properly nested up to 4 levels for complete drill-down functionality.

2. **All Planets Required:** The `planetary` object must include all 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu).

3. **Divisional Charts:** While D1 and D9 are required, providing all divisional charts (D1-D60) will enhance the user experience.

4. **Null Safety:** Any field that might be unavailable should be set to `null` or omitted. The frontend handles missing data gracefully.

5. **Date Consistency:** Use YYYY-MM-DD format for all dates.

6. **Dynamic Content:** Fields like `description`, `consideration`, `asc_report`, and `mukhi_details` should come from backend calculations, not hardcoded in frontend.

7. **Optional Enhancements:** While many fields are optional, providing complete data (yogas, ashtakvarga, dosha details, remedies details) significantly improves the report quality.

---

## API Endpoint Summary

```
GET /kundli/:userRequestId

Response: 200 OK
{
  "success": true,
  "kundli": { /* Complete KundliData object as documented above */ }
}

Error Response: 400/404/500
{
  "success": false,
  "message": "Error message here"
}
```

---

This documentation provides the complete structure expected by the frontend. Backend developers should use this as a reference to ensure their API responses are compatible with the frontend implementation.
