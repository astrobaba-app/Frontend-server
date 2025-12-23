import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:6001/api";

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL.replace('/api', ''), // Remove /api if present since we add it in routes
  withCredentials: true,
});

export interface KundliListItem {
  id: string;
  fullName: string;
  dateOfbirth: string;
  timeOfbirth: string;
  placeOfBirth: string;
  gender: string;
  createdAt: string;
  hasKundli: boolean;
}

export interface ReportContent {
  overview: string;
  careerFinance: string;
  relationships: string;
  healthWellness: string;
  spiritualGrowth: string;
  monthlyPredictions: string;
  remedies: string[];
}

export interface ReportData {
  success: boolean;
  reportContent: ReportContent;
  metadata: {
    generatedAt: string;
    model: string;
  };
}

/**
 * Get all user's kundlis for report generation
 */
export async function getUserKundlisForReport(): Promise<{
  success: boolean;
  kundlis: KundliListItem[];
}> {
  const response = await api.get("/api/kundli-report/user-kundlis");
  return response.data;
}

/**
 * Generate Kundli report content (with AI enhancement)
 */
export async function generateKundliReport(userRequestId: string): Promise<{
  success: boolean;
  message: string;
  reportData: ReportData & {
    userDetails: {
      fullName: string;
      dateOfbirth: string;
      timeOfbirth: string;
      placeOfBirth: string;
      gender: string;
    };
    kundliId: string;
  };
}> {
  const response = await api.post("/api/kundli-report/generate", {
    userRequestId,
  });
  return response.data;
}

/**
 * Download PDF report
 */
export async function downloadKundliReportPDF(userRequestId: string): Promise<Blob> {
  const response = await api.post(
    "/api/kundli-report/download",
    { userRequestId },
    {
      responseType: "blob",
    }
  );
  return response.data;
}

/**
 * Preview PDF report (base64)
 */
export async function previewKundliReportPDF(userRequestId: string): Promise<{
  success: boolean;
  message: string;
  pdfData: string; // base64 encoded
}> {
  const response = await api.post("/api/kundli-report/preview", {
    userRequestId,
  });
  return response.data;
}
