import { AssessmentData } from "./types";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

export const generatePDF = (assessmentResult: AssessmentData) => {
  const { userInfo, reactiveScore, strategicScore, interpretation, date, questions } = assessmentResult;
  const doc = new jsPDF();
  
  // Add a title
  doc.setFontSize(20);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
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
  
  let yPosition = 70;
  
  if (userInfo.organization) {
    doc.text(`Organization: ${userInfo.organization}`, 20, yPosition);
    yPosition += 10;
  }
  
  if (userInfo.role) {
    doc.text(`Role: ${userInfo.role}`, 20, yPosition);
    yPosition += 10;
  }
  
  // Add assessment date
  doc.text(`Assessment Date: ${format(new Date(date), "MMMM d, yyyy")}`, 20, yPosition);
  yPosition += 20;
  
  // Add scores
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
  
  // Add interpretation
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
  
  // Split interpretation text to avoid overflow
  const interpretationDescription = interpretation.split(":")[1]?.trim() || interpretation;
  const splitDescription = doc.splitTextToSize(interpretationDescription, 170);
  doc.text(splitDescription, 20, yPosition);
  yPosition += splitDescription.length * 8;
  
  // Add interpretation guide
  doc.setFontSize(16);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text("Interpret Your Scores", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("Mostly Reactive (>25 on Reactive, <20 on Strategic):", 20, yPosition);
  yPosition += 10;
  doc.text("You may be leading from fear of disapproval or control.", 25, yPosition);
  yPosition += 10;
  doc.text("Mixed (20–25 in both):", 20, yPosition);
  yPosition += 10;
  doc.text("You're in a transition zone—aware of new ways but held back by old patterns.", 25, yPosition);
  yPosition += 10;
  doc.text("Mostly Strategic (>25 on Strategic, <20 on Reactive):", 20, yPosition);
  yPosition += 10;
  doc.text("You're leading from vision, self-trust, and courage.", 25, yPosition);
  yPosition += 20;
  
  // Add detailed questions and responses
  // Add a new page for questions if we're running out of space
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text("Your Responses", 20, yPosition);
  yPosition += 10;
  
  // First the reactive questions
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text("Reactive Tendencies", 20, yPosition);
  yPosition += 10;
  
  const reactiveQuestions = questions.filter(q => q.category === "reactive");
  
  reactiveQuestions.forEach((question, index) => {
    if (yPosition > 270) {
      doc.addPage();
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
  
  // Now the strategic questions
  if (yPosition > 250) {
    doc.addPage();
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
  
  // Add footer on last page
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Leadership Self-Check Assessment Results", 105, 280, { align: "center" });
  
  // Save the PDF
  doc.save(`leadership-assessment-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};
