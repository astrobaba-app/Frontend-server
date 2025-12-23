"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/atoms/Toast";
import {
  getUserKundlisForReport,
  generateKundliReport,
  downloadKundliReportPDF,
  KundliListItem,
  ReportData,
} from "@/store/api/kundliReport";
import { FileText, Download, Eye, Loader2, Calendar, MapPin, Clock } from "lucide-react";

export default function KundliReportPage() {
  const router = useRouter();
  const { showToast, toastProps, hideToast } = useToast();

  const [kundlis, setKundlis] = useState<KundliListItem[]>([]);
  const [selectedKundli, setSelectedKundli] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchKundlis();
  }, []);

  const fetchKundlis = async () => {
    try {
      setLoading(true);
      const response = await getUserKundlisForReport();
      if (response.success) {
        setKundlis(response.kundlis);
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to load kundlis", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedKundli) {
      showToast("Please select a kundli first", "error");
      return;
    }

    try {
      setGenerating(true);
      const response = await generateKundliReport(selectedKundli);
      
      if (response.success) {
        setReportData(response.reportData);
        setShowPreview(true);
        showToast("Report generated successfully!", "success");
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to generate report", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedKundli) return;

    try {
      setLoading(true);
      const blob = await downloadKundliReportPDF(selectedKundli);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Kundli_Report_${new Date().getFullYear()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast("PDF downloaded successfully!", "success");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to download PDF", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && kundlis.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!showPreview) {
    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
        <Card padding="lg" className="shadow-sm border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <Heading level={2} className="text-xl sm:text-2xl flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary-600" />
              Generate Kundli Report (PDF)
            </Heading>
          </div>

          <p className="text-gray-600 mb-6">
            Select a kundli to generate a comprehensive yearly Vedic astrology report with AI-enhanced insights.
          </p>

          {kundlis.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No kundlis found</p>
              <Button
                variant="primary"
                onClick={() => router.push("/profile/kundli")}
              >
                Create Your First Kundli
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {kundlis.map((kundli) => (
                  <div
                    key={kundli.id}
                    onClick={() => setSelectedKundli(kundli.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedKundli === kundli.id
                        ? "border-primary-500 bg-primary-50 shadow-md"
                        : "border-gray-200 hover:border-primary-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {kundli.fullName}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(kundli.dateOfbirth)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{kundli.timeOfbirth}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <MapPin className="w-4 h-4" />
                            <span>{kundli.placeOfBirth}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedKundli === kundli.id
                            ? "border-primary-500 bg-primary-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedKundli === kundli.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGenerateReport}
                  disabled={!selectedKundli || generating}
                  className="flex-1"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </Card>
        <Toast {...toastProps} onClose={hideToast} />
      </div>
    );
  }

  // Preview Screen
  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <Card padding="lg" className="shadow-sm border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <Heading level={2} className="text-xl sm:text-2xl flex items-center gap-3">
            <Eye className="w-6 h-6 text-primary-600" />
            Report Preview
          </Heading>
          <Button
            variant="outline"
            onClick={() => {
              setShowPreview(false);
              setReportData(null);
            }}
          >
            Back
          </Button>
        </div>

        {reportData && (
          <>
            {/* User Details */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3">
                Yearly Vedic Astrology Report - {reportData.userDetails.fullName}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="ml-2 font-medium">{formatDate(reportData.userDetails.dateOfbirth)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <span className="ml-2 font-medium">{reportData.userDetails.timeOfbirth}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Place:</span>
                  <span className="ml-2 font-medium">{reportData.userDetails.placeOfBirth}</span>
                </div>
              </div>
            </div>

            {/* Report Content Preview */}
            <div className="space-y-6 mb-6 max-h-[500px] overflow-y-auto pr-2">
              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Overview</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {reportData.reportContent.overview}
                </p>
              </div>

              {/* Career & Finance */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Career & Finance</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {reportData.reportContent.careerFinance}
                </p>
              </div>

              {/* Relationships */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Relationships</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {reportData.reportContent.relationships}
                </p>
              </div>

              {/* Additional sections preview hint */}
              <div className="text-center py-4 border-t border-gray-200">
                <p className="text-gray-500 text-sm">
                  + Health & Wellness, Spiritual Growth, Monthly Predictions, and more in the full PDF...
                </p>
              </div>
            </div>

            {/* Download Button */}
            <div className="border-t pt-6">
              <Button
                variant="primary"
                size="lg"
                onClick={handleDownloadPDF}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Full PDF Report
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </Card>
      <Toast {...toastProps} onClose={hideToast} />
    </div>
  );
}
