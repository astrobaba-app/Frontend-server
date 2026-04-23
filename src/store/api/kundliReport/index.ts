import api from "../index";
import { AxiosError } from "axios";

export interface KundliListItem {
  id: string;
  fullName: string;
  dateOfbirth: string;
  timeOfbirth: string;
  placeOfBirth: string;
  gender: string;
  createdAt: string;
  hasKundli: boolean;
  hasReport: boolean;
  reportGeneratedAt: string | null;
  hasPdf?: boolean;
  reportPdfUrl?: string | null;
  reportPdfUploadedAt?: string | null;
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

export interface KundliReportResponse {
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
    userRequestId: string;
    generatedAt: string;
    pdfUrl?: string | null;
    pdfPublicId?: string | null;
    pdfFileName?: string | null;
    pdfUploadedAt?: string | null;
  };
}

const extractBlobErrorMessage = async (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<Blob>;
  const responseBlob = axiosError?.response?.data;

  if (responseBlob instanceof Blob) {
    try {
      const rawText = await responseBlob.text();
      const parsed = JSON.parse(rawText) as { message?: string; error?: string };
      if (parsed?.message || parsed?.error) {
        return parsed.message || parsed.error || fallback;
      }
    } catch {
      // Fall through to generic fallback below.
    }
  }

  return axiosError.message || fallback;
};

/**
 * Get all user's kundlis for report generation
 */
export async function getUserKundlisForReport(): Promise<{
  success: boolean;
  kundlis: KundliListItem[];
}> {
  const response = await api.get("/kundli-report/user-kundlis");
  return response.data;
}

/**
 * Generate Kundli report content (with AI enhancement)
 */
export async function generateKundliReport(userRequestId: string): Promise<KundliReportResponse & {
  alreadyGenerated?: boolean;
}> {
  const response = await api.post("/kundli-report/generate", {
    userRequestId,
  });
  return response.data;
}

/**
 * Fetch existing generated report content for a kundli
 */
export async function getGeneratedKundliReport(userRequestId: string): Promise<KundliReportResponse> {
  const response = await api.get(`/kundli-report/generated/${userRequestId}`);
  return response.data;
}

/**
 * Download PDF report
 */
export async function downloadKundliReportPDF(userRequestId: string): Promise<Blob> {
  try {
    const response = await api.post(
      "/kundli-report/download",
      { userRequestId },
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    const message = await extractBlobErrorMessage(error, "Failed to download PDF");
    throw new Error(message);
  }
}

/**
 * Preview PDF report (base64)
 */
export async function previewKundliReportPDF(userRequestId: string): Promise<{
  success: boolean;
  message: string;
  pdfData: string; // base64 encoded
  pdfUrl?: string | null;
  pdfPublicId?: string | null;
  pdfFileName?: string | null;
  pdfUploadedAt?: string | null;
}> {
  const response = await api.post("/kundli-report/preview", {
    userRequestId,
  });
  return response.data;
}
