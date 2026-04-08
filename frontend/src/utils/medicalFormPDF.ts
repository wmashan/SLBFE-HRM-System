import jsPDF from 'jspdf';

export interface MedicalFormData {
  employeeNo: string;
  employeeFullName: string;
  employeeAddress: string;
  patientName: string;
  patientDOB: {
    day: string;
    month: string;
    year: string;
  };
  patientSex: 'M' | 'F';
  hospitalName: string;
  isGovernmentHospital: boolean;
  hospitalizationFrom: {
    day: string;
    month: string;
    year: string;
  };
  hospitalizationTo: {
    day: string;
    month: string;
    year: string;
  };
  totalCharges: string;
  chargesBreakdown: string;
  date: string;
}

export const generateMedicalClaimPDF = (formData: MedicalFormData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Border
  doc.setLineWidth(0.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  // Header - Form Number
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.rect(pageWidth - 45, 15, 30, 10);
  doc.text('HR/F/08', pageWidth - 40, 22);
  
  // Title Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const title1 = 'SRI LANKA BUREAU OF FOREIGN EMPLOYMENT';
  const title2 = 'NO. 234, DENZIL KOBBEKADUWA MAWATHA,';
  const title3 = 'KOSWATTA, BATTARAMULLA.';
  
  doc.text(title1, pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(title2, pageWidth / 2, 37, { align: 'center' });
  doc.text(title3, pageWidth / 2, 43, { align: 'center' });
  
  // Contact Information
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Tel : 2864101/ 2864102/ 2864103/ 2864104/ 2864105', pageWidth / 2, 49, { align: 'center' });
  doc.text('Fax :2864130', pageWidth / 2, 54, { align: 'center' });
  
  // Form Title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SURGICAL & HOSPITAL EXPENSESS CLAIM FORM', 15, 65);
  doc.setLineWidth(0.3);
  doc.line(15, 67, 120, 67);
  
  let yPos = 80;
  
  // Employee Number
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Employee No : ${formData.employeeNo}`, pageWidth - 80, yPos);
  
  yPos += 10;
  
  // Full Name of Employee
  doc.setFont('helvetica', 'normal');
  doc.text('Full Name of Employee :', 15, yPos);
  doc.setFont('helvetica', 'normal');
  const nameLines = doc.splitTextToSize(formData.employeeFullName, 120);
  doc.text(nameLines, 75, yPos);
  doc.line(75, yPos + 2, 195, yPos + 2);
  
  yPos += 10;
  if (nameLines.length > 1) yPos += 5;
  
  // Address
  doc.setFont('helvetica', 'normal');
  doc.text('Address :', 15, yPos);
  const addressLines = doc.splitTextToSize(formData.employeeAddress, 120);
  doc.text(addressLines, 75, yPos);
  doc.line(75, yPos + 2, 195, yPos + 2);
  
  yPos += 15;
  if (addressLines.length > 1) yPos += (addressLines.length - 1) * 5;
  
  // Section 2: Person in Respect of Whom Claim is Made
  doc.setLineWidth(0.5);
  doc.rect(12, yPos, pageWidth - 24, 25);
  
  doc.setFont('helvetica', 'bold');
  doc.text('2.', 15, yPos + 6);
  doc.text('Person in Respect of Whom Claim is Made', 22, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Name', 20, yPos + 13);
  doc.text(':', 45, yPos + 13);
  doc.text(formData.patientName, 50, yPos + 13);
  doc.line(50, yPos + 14, 195, yPos + 14);
  
  // Date of Birth
  doc.text('Date of Birth', 20, yPos + 21);
  doc.text(':', 45, yPos + 21);
  
  // DOB Boxes
  doc.text('Day', 52, yPos + 19);
  doc.text('Month', 67, yPos + 19);
  doc.text('Year', 87, yPos + 19);
  
  doc.rect(50, yPos + 20, 12, 6);
  doc.rect(65, yPos + 20, 17, 6);
  doc.rect(85, yPos + 20, 20, 6);
  
  doc.text(formData.patientDOB.day, 56, yPos + 24.5);
  doc.text(formData.patientDOB.month, 73, yPos + 24.5);
  doc.text(formData.patientDOB.year, 95, yPos + 24.5);
  
  // Sex
  doc.text('Sex', 140, yPos + 21);
  doc.rect(155, yPos + 20, 6, 6);
  doc.rect(168, yPos + 20, 6, 6);
  doc.text('M', 152, yPos + 24.5);
  doc.text('F', 165, yPos + 24.5);
  
  if (formData.patientSex === 'M') {
    doc.text('X', 156.5, yPos + 24.5);
  } else {
    doc.text('X', 169.5, yPos + 24.5);
  }
  
  yPos += 30;
  
  // Section 3: General
  doc.setLineWidth(0.5);
  doc.rect(12, yPos, pageWidth - 24, 75);
  
  doc.setFont('helvetica', 'bold');
  doc.text('3.', 15, yPos + 6);
  doc.text('General  :', 22, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  yPos += 10;
  
  // a. Name of the Hospital
  doc.text('a.', 20, yPos);
  doc.text('Name of the Hospital:', 27, yPos);
  doc.text(formData.hospitalName, 75, yPos);
  doc.line(75, yPos + 1, 195, yPos + 1);
  
  yPos += 8;
  
  // b. Is it a Government Hospital?
  doc.text('b.', 20, yPos);
  doc.text('Is it a Government Hospital?', 27, yPos);
  doc.text('Yes', 115, yPos);
  doc.rect(125, yPos - 4, 6, 6);
  doc.text('No', 145, yPos);
  doc.rect(155, yPos - 4, 6, 6);
  
  if (formData.isGovernmentHospital) {
    doc.text('X', 126.5, yPos);
  } else {
    doc.text('X', 156.5, yPos);
  }
  
  yPos += 10;
  
  // c. Period of Hospitalization
  doc.text('c.', 20, yPos);
  doc.text('Period of Hospitalization', 27, yPos);
  doc.text('From', 85, yPos);
  
  // From Date
  doc.text('Day', 100, yPos - 3);
  doc.text('Month', 115, yPos - 3);
  doc.text('Year', 133, yPos - 3);
  
  doc.rect(98, yPos + 1, 12, 6);
  doc.rect(113, yPos + 1, 17, 6);
  doc.rect(133, yPos + 1, 17, 6);
  
  doc.text(formData.hospitalizationFrom.day, 104, yPos + 5.5);
  doc.text(formData.hospitalizationFrom.month, 121, yPos + 5.5);
  doc.text(formData.hospitalizationFrom.year, 141, yPos + 5.5);
  
  doc.text('To', 155, yPos);
  
  // To Date
  doc.text('Day', 163, yPos - 3);
  doc.text('Month', 178, yPos - 3);
  doc.text('Year', 193, yPos - 3);
  
  // Adjust for page width
  doc.rect(161, yPos + 1, 12, 6);
  doc.rect(176, yPos + 1, 14, 6);
  
  doc.text(formData.hospitalizationTo.day, 167, yPos + 5.5);
  doc.text(formData.hospitalizationTo.month, 182, yPos + 5.5);
  
  yPos += 10;
  
  // d. Hospitalization charges
  doc.text('d.', 20, yPos);
  doc.setFontSize(9);
  const chargesText = 'Hospitalization charges including Nursing Home chargers, Surgeon\'s fees, Anesthetist\'s Operation Theatre';
  doc.text(chargesText, 27, yPos);
  yPos += 5;
  const chargesText2 = 'charges, Expenses for X-Ray, ECG, Laboratory Tests, Medicines and Drugs, Fees paid to medical Practitioner';
  doc.text(chargesText2, 27, yPos);
  yPos += 5;
  doc.text('and all other expenses whilst in hospital:', 27, yPos);
  
  yPos += 10;
  
  // Total Charges Box
  doc.setFontSize(10);
  doc.text('Rs.', 85, yPos);
  doc.rect(95, yPos - 5, 50, 8);
  doc.text(formData.totalCharges, 100, yPos);
  
  yPos += 15;
  
  // Declaration
  doc.setFont('helvetica', 'bold');
  doc.text('DECLARATION', 15, yPos);
  doc.setFont('helvetica', 'italic');
  
  yPos += 6;
  const declaration1 = 'I declare that the particulars given herein above are true and correct to the best of my knowledge and that I have not';
  const declaration2 = 'withheld from the SLBFE any material information connected with this claim.';
  
  doc.setFontSize(9);
  doc.text(declaration1, 15, yPos);
  yPos += 5;
  doc.text(declaration2, 15, yPos);
  
  yPos += 15;
  
  // Signature Section
  doc.setFont('helvetica', 'normal');
  doc.text(`Date : ${formData.date}`, 15, yPos);
  doc.text('Signature of Employee', pageWidth - 80, yPos);
  doc.line(pageWidth - 80, yPos + 2, pageWidth - 20, yPos + 2);
  
  // Footer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const footerY = pageHeight - 15;
  doc.line(12, footerY, pageWidth - 12, footerY);
  doc.text('DOC NO: HR/F/08', 15, footerY + 4);
  doc.text('ISSUE NO: 01', 60, footerY + 4);
  doc.text('REVISION NO : 00', 95, footerY + 4);
  doc.text('DATE OF ISSUE :20.09.2022', 135, footerY + 4);
  doc.text('DATE OF REVISION:00', 180, footerY + 4);
  doc.text('PAGE 01 OF 02', pageWidth - 35, footerY + 4);
  
  // Save the PDF
  const fileName = `Medical_Claim_${formData.employeeNo}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
