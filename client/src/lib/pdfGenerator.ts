import { AssessmentData } from "./types";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

export const generatePDF = (assessmentResult: AssessmentData) => {
  const { userInfo, reactiveScore, strategicScore, interpretation, date } = assessmentResult;
  const doc = new jsPDF();
  
  // Add a title
  doc.setFontSize(20);
  doc.setTextColor(124, 93, 173); // Light purple color
  doc.text("Leadership Self-Check Results", 105, 20, { align: "center" });
  
  // Add a subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Are You Leading Strategically or Reactively?", 105, 30, { align: "center" });
  
  // Add user information
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(`Name: ${userInfo.name}`, 20, 50);
  doc.text(`Email: ${userInfo.email}`, 20, 60);
  
  if (userInfo.organization) {
    doc.text(`Organization: ${userInfo.organization}`, 20, 70);
  }
  
  if (userInfo.role) {
    doc.text(`Role: ${userInfo.role}`, 20, 80);
  }
  
  // Add assessment date
  doc.text(`Assessment Date: ${format(new Date(date), "MMMM d, yyyy")}`, 20, 90);
  
  // Add scores
  doc.setFontSize(16);
  doc.setTextColor(124, 93, 173); // Light purple color
  doc.text("Your Scores", 20, 110);
  
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(`Reactive Score: ${reactiveScore} / 35 (${Math.round((reactiveScore / 35) * 100)}%)`, 20, 120);
  doc.text(`Strategic Score: ${strategicScore} / 35 (${Math.round((strategicScore / 35) * 100)}%)`, 20, 130);
  
  // Add interpretation
  doc.setFontSize(16);
  doc.setTextColor(124, 93, 173); // Light purple color
  doc.text("Interpretation", 20, 150);
  
  // Determine interpretation title
  let interpretationTitle = "";
  if (strategicScore > 25 && reactiveScore < 20) {
    interpretationTitle = "Mostly Strategic (>25 on Strategic, <20 on Reactive)";
  } else if (reactiveScore > 25 && strategicScore < 20) {
    interpretationTitle = "Mostly Reactive (>25 on Reactive, <20 on Strategic)";
  } else {
    interpretationTitle = "Mixed (20–25 in both)";
  }
  
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(interpretationTitle, 20, 160);
  
  // Split interpretation text to avoid overflow
  const interpretationDescription = interpretation.split(":")[1]?.trim() || interpretation;
  const splitDescription = doc.splitTextToSize(interpretationDescription, 170);
  doc.text(splitDescription, 20, 170);
  
  // Add scoring guide
  doc.setFontSize(16);
  doc.setTextColor(124, 93, 173); // Light purple color
  doc.text("Scoring Guide", 20, 190);
  
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("40–50: High-performing team in sync", 20, 200);
  doc.text("30–39: Partially aligned", 20, 210);
  doc.text("20–29: Functional but fractured", 20, 220);
  doc.text("Under 20: Consider team reset", 20, 230);
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Leadership Self-Check Assessment Results", 105, 280, { align: "center" });
  
  // Save the PDF
  doc.save(`leadership-assessment-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};
