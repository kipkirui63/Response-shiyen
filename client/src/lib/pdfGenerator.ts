import { AssessmentData } from "./types";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import logoImage from "@/assets/DDLL_Logo_Converted.png";
import faviconImage from "@/assets/favicon/favicon.png";

export const generatePDF = (assessmentResult: AssessmentData) => {
  const { userInfo, reactiveScore, strategicScore, interpretation, date, questions } = assessmentResult;
  const doc = new jsPDF();
  
  // Add favicon - a small DDL logo in the top right corner of each page
  const addFavicon = (doc: jsPDF) => {
    // Add small logo as a "favicon" in top right corner
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text("Dream.", 190, 10, { align: "right" });
    doc.setTextColor(190, 46, 214); // Mauve color
    doc.text("Dare.", 190, 14, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.text("Lead.", 190, 18, { align: "right" });
  };
  
  // Add favicon to first page
  addFavicon(doc);
  
  // Instead of trying to use the image directly (which can be complex in PDF generation),
  // Let's create text that represents the logo in the PDF centered at the top
  
  // First word - Dream
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Dream.", 105, 20, { align: "center" });
  
  // Second word - Dare (in mauve color)
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text("Dare.", 105, 27, { align: "center" });
  
  // Third word - Lead
  doc.setTextColor(0, 0, 0);
  doc.text("Lead.", 105, 34, { align: "center" });
  
  // Add a title
  doc.setFontSize(20);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text("Leadership Self-Check Results", 105, 45, { align: "center" });
  
  // Add a subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Are You Leading Strategically or Reactively?", 105, 53, { align: "center" });
  
  let yPosition = 70;
  
  // 1. NAME, EMAIL, ASSESSMENT DATE
  doc.setFontSize(16);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text("Personal Information", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(`Name: ${userInfo.name}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Email: ${userInfo.email}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Assessment Date: ${format(new Date(date), "MMMM d, yyyy")}`, 20, yPosition);
  yPosition += 20;
  
  // 2. YOUR RESPONSES
  doc.setFontSize(16);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text("Your Responses", 20, yPosition);
  yPosition += 10;
  
  // Reactive questions
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text("Reactive Tendencies", 20, yPosition);
  yPosition += 10;
  
  const reactiveQuestions = questions.filter(q => q.category === "reactive");
  
  reactiveQuestions.forEach((question, index) => {
    if (yPosition > 270) {
      doc.addPage();
      addFavicon(doc); // Add favicon to the new page
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    const questionText = doc.splitTextToSize(`${question.id}. ${question.text}`, 170);
    doc.text(questionText, 20, yPosition);
    yPosition += questionText.length * 6;
    
    doc.setFontSize(12);
    doc.setTextColor(190, 46, 214); // Mauve color for rating
    doc.text(`Your rating: ${question.value !== null ? question.value : 'N/A'} / 5`, 30, yPosition);
    yPosition += 10;
    
    doc.setTextColor(80, 80, 80); // Reset text color
  });
  
  yPosition += 5;
  
  // Strategic questions
  if (yPosition > 250) {
    doc.addPage();
    addFavicon(doc); // Add favicon to the new page
    yPosition = 20;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text("Strategic/Creative Tendencies", 20, yPosition);
  yPosition += 10;
  
  const strategicQuestions = questions.filter(q => q.category === "strategic");
  
  strategicQuestions.forEach((question, index) => {
    if (yPosition > 270) {
      doc.addPage();
      addFavicon(doc); // Add favicon to the new page
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    const questionText = doc.splitTextToSize(`${question.id}. ${question.text}`, 170);
    doc.text(questionText, 20, yPosition);
    yPosition += questionText.length * 6;
    
    doc.setFontSize(12);
    doc.setTextColor(190, 46, 214); // Mauve color for rating
    doc.text(`Your rating: ${question.value !== null ? question.value : 'N/A'} / 5`, 30, yPosition);
    yPosition += 10;
    
    doc.setTextColor(80, 80, 80); // Reset text color
  });
  
  // 3. YOUR SCORES
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  // No colored background for scores, keeping it clean and white
  
  doc.setFontSize(16);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text("Your Scores", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(`Reactive Score: ${reactiveScore} / 35 (${Math.round((reactiveScore / 35) * 100)}%)`, 20, yPosition);
  yPosition += 10;
  doc.text(`Strategic Score: ${strategicScore} / 35 (${Math.round((strategicScore / 35) * 100)}%)`, 20, yPosition);
  yPosition += 20;
  
  // 4. INTERPRETATION
  
  // No colored background for interpretation, keeping it clean and white
  
  // Calculate the height needed for interpretation text
  const interpretationDescription = interpretation.split(":")[1]?.trim() || interpretation;
  const splitDescription = doc.splitTextToSize(interpretationDescription, 170);
  
  doc.setFontSize(16);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text("Interpretation", 20, yPosition);
  yPosition += 10;
  
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
  doc.text(interpretationTitle, 20, yPosition);
  yPosition += 10;
  
  // Add the interpretation text
  doc.text(splitDescription, 20, yPosition);
  
  // Add footer on last page
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Leadership Self-Check Assessment Results", 105, 280, { align: "center" });
  
  // Save the PDF
  doc.save(`leadership-assessment-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};
