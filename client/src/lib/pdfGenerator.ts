import { AssessmentData } from "./types";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import logoImage from "@/assets/DDLL_Logo_Converted.png";

export const generatePDF = (assessmentResult: AssessmentData) => {
  const { userInfo, reactiveScore, strategicScore, interpretation, date, questions } = assessmentResult;
  const doc = new jsPDF();
  
  // Add the real DDL logo image (centered at the top)
  try {
    // Convert logo image source to base64
    const img = new Image();
    img.src = logoImage;
    
    // Display the logo image at the top center
    // We'll add using the data URL approach
    doc.addImage(logoImage, 'PNG', 80, 15, 50, 20); // centered position, scaled size
  } catch (e) {
    console.error("Error adding logo to PDF:", e);
  }
  
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
  
  // Reactive questions with mauve background
  // Add a mauve rectangle for the heading background
  doc.setFillColor(190, 46, 214); // Mauve color #be2ed6
  doc.rect(15, yPosition - 15, 180, 20, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255); // White text
  doc.text("Reactive Tendencies", 20, yPosition);
  yPosition += 10;
  
  const reactiveQuestions = questions.filter(q => q.category === "reactive");
  
  reactiveQuestions.forEach((question, index) => {
    if (yPosition > 270) {
      doc.addPage();
      // Add the logo to the new page
      try {
        doc.addImage(logoImage, 'PNG', 170, 10, 20, 8); // small logo in top right
      } catch (e) {
        console.error("Error adding logo to new page:", e);
      }
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
    // Add the logo to the new page
    try {
      doc.addImage(logoImage, 'PNG', 170, 10, 20, 8); // small logo in top right
    } catch (e) {
      console.error("Error adding logo to new page:", e);
    }
    yPosition = 20;
  }
  
  // Strategic questions with mauve background
  // Add a mauve rectangle for the heading background
  doc.setFillColor(190, 46, 214); // Mauve color #be2ed6
  doc.rect(15, yPosition - 15, 180, 20, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255); // White text
  doc.text("Strategic/Creative Tendencies", 20, yPosition);
  yPosition += 10;
  
  const strategicQuestions = questions.filter(q => q.category === "strategic");
  
  strategicQuestions.forEach((question, index) => {
    if (yPosition > 270) {
      doc.addPage();
      // Add the logo to the new page
      try {
        doc.addImage(logoImage, 'PNG', 170, 10, 20, 8); // small logo in top right
      } catch (e) {
        console.error("Error adding logo to new page:", e);
      }
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
    // Add the logo to the new page
    try {
      doc.addImage(logoImage, 'PNG', 170, 10, 20, 8); // small logo in top right
    } catch (e) {
      console.error("Error adding logo to new page:", e);
    }
    yPosition = 20;
  }
  
  // No colored background for scores, keeping it clean and white
  
  doc.setFontSize(16);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text("Your Scores", 20, yPosition);
  yPosition += 10;
  
  // Reactive Score
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", 'bold');
  doc.text("Reactive Score:", 20, yPosition);
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text(`${reactiveScore} / 35 (${Math.round((reactiveScore / 35) * 100)}%)`, 80, yPosition);
  
  yPosition += 10;
  
  // Strategic Score
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", 'bold');
  doc.text("Strategic Score:", 20, yPosition);
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.text(`${strategicScore} / 35 (${Math.round((strategicScore / 35) * 100)}%)`, 80, yPosition);
  yPosition += 20;
  
  // Add scoring guide with bullet points
  doc.setFontSize(16);
  doc.setTextColor(190, 46, 214); // Mauve color #be2ed6
  doc.setFont("helvetica", 'bold');
  doc.text("Interpret Your Scores", 20, yPosition);
  yPosition += 10;
  
  // Add bullet points
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  
  // Bullet for Mostly Reactive
  doc.text("•", 20, yPosition);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", 'bold');
  doc.text("Mostly Reactive (>25 on Reactive, <20 on Strategic):", 25, yPosition);
  yPosition += 7;
  doc.setFont("helvetica", 'normal');
  doc.text("You may be leading from fear of disapproval or control.", 25, yPosition);
  yPosition += 15;
  
  // Bullet for Mixed
  doc.text("•", 20, yPosition);
  doc.setFont("helvetica", 'bold');
  doc.text("Mixed (20–25 in both):", 25, yPosition);
  yPosition += 7;
  doc.setFont("helvetica", 'normal');
  doc.text("You're in a transition zone—aware of new ways but held back by old patterns.", 25, yPosition);
  yPosition += 15;
  
  // Bullet for Mostly Strategic
  doc.text("•", 20, yPosition);
  doc.setFont("helvetica", 'bold');
  doc.text("Mostly Strategic (>25 on Strategic, <20 on Reactive):", 25, yPosition);
  yPosition += 7;
  doc.setFont("helvetica", 'normal');
  doc.text("You're leading from vision, self-trust, and courage.", 25, yPosition);
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
