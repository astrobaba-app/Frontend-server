"use client";
import React from "react";
import SectionCard from "@/components/kundli/SectionCard";

interface GeneralTabContentProps {
  personality: any;
}

const GeneralTabContent: React.FC<GeneralTabContentProps> = ({ personality }) => {
  const sections = [
    {
      title: "Description",
      content: personality?.asc_report?.report || "No description available.",
    },
    {
      title: "Personality",
      content: personality?.personality_report || "No personality data available.",
    },
    {
      title: "Physical",
      content: personality?.physical_report || "No physical data available.",
    },
    {
      title: "Health",
      content: personality?.health_report || "No health data available.",
    },
    {
      title: "Career",
      content: personality?.career_report || "No career data available.",
    },
    {
      title: "Relationship",
      content: personality?.relationship_report || "No relationship data available.",
    },
  ];

  return (
    <div className="space-y-6">
      {personality?.asc_report?.ascendant && (
        <p className="text-sm text-gray-600">
          Your ascendant is <span className="font-semibold">{personality.asc_report.ascendant}</span>.
        </p>
      )}
      {sections.map((section, index) => (
        <SectionCard key={index} title={section.title} content={section.content} />
      ))}
    </div>
  );
};

export default GeneralTabContent;
