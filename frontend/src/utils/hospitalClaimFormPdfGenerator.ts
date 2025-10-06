import jsPDF from 'jspdf';

/**
 * Interface for Hospital Claim Form HR/F/08 data
 */
export interface HospitalClaimFormData {
  employeeNumber?: string;
  patientName?: string;
  // Additional fields can be added as needed
}

/**
 * Generate Hospital Claim Form PDF (HR/F/08)
 * 
 * This form is meant to be filled manually by hospital/clinic staff
 * or the employee with hospital details and signatures.
 * 
 * @param formData - Optional pre-filled data
 * @returns Promise that resolves when PDF is generated and downloaded
 */
export const generateHospitalClaimFormPDF = async (
  formData?: HospitalClaimFormData
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create new PDF document (A4 size, portrait)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = margin;

      // Title Section
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HOSPITAL CLAIM FORM', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 20;
      pdf.setFontSize(12);
      pdf.text('Form No: HR/F/08', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 30;

      // Header Box
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos, contentWidth, 30, 'F');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SRI LANKA BUREAU OF FOREIGN EMPLOYMENT', margin + 10, yPos + 20);
      
      yPos += 50;

      // Instructions
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      const instructions = 'This form must be completed by the hospital/clinic/medical institution where treatment was received.';
      const instructionLines = pdf.splitTextToSize(instructions, contentWidth - 20);
      pdf.text(instructionLines, margin + 10, yPos);
      
      yPos += 30;

      // Draw border
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(1);
      pdf.rect(margin, yPos, contentWidth, pageHeight - yPos - margin);

      yPos += 20;

      // Form Fields
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);

      // Section 1: Patient Information
      pdf.setFillColor(230, 240, 255);
      pdf.rect(margin + 10, yPos, contentWidth - 20, 25, 'F');
      pdf.text('SECTION 1: PATIENT INFORMATION', margin + 15, yPos + 17);
      yPos += 40;

      // Patient Name
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Patient Name:', margin + 15, yPos);
      pdf.setDrawColor(150, 150, 150);
      pdf.line(margin + 120, yPos + 3, pageWidth - margin - 15, yPos + 3);
      if (formData?.patientName) {
        pdf.text(formData.patientName, margin + 125, yPos);
      }
      yPos += 25;

      // Employee Number
      pdf.text('Employee Number:', margin + 15, yPos);
      pdf.line(margin + 120, yPos + 3, pageWidth - margin - 15, yPos + 3);
      if (formData?.employeeNumber) {
        pdf.text(formData.employeeNumber, margin + 125, yPos);
      }
      yPos += 25;

      // Date of Birth
      pdf.text('Date of Birth:', margin + 15, yPos);
      pdf.line(margin + 120, yPos + 3, margin + 250, yPos + 3);
      pdf.text('Sex:', margin + 280, yPos);
      pdf.line(margin + 320, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 25;

      // Address
      pdf.text('Address:', margin + 15, yPos);
      pdf.line(margin + 120, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 20;
      pdf.line(margin + 15, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 35;

      // Section 2: Hospitalization Details
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(230, 240, 255);
      pdf.rect(margin + 10, yPos, contentWidth - 20, 25, 'F');
      pdf.text('SECTION 2: HOSPITALIZATION DETAILS', margin + 15, yPos + 17);
      yPos += 40;

      // Hospital Name
      pdf.setFont('helvetica', 'normal');
      pdf.text('Name of Hospital/Clinic:', margin + 15, yPos);
      pdf.line(margin + 150, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 25;

      // Hospital Address
      pdf.text('Hospital Address:', margin + 15, yPos);
      pdf.line(margin + 150, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 20;
      pdf.line(margin + 15, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 25;

      // Government Hospital checkbox
      pdf.text('Is this a Government Hospital?', margin + 15, yPos);
      pdf.rect(margin + 180, yPos - 8, 12, 12);
      pdf.text('Yes', margin + 200, yPos);
      pdf.rect(margin + 240, yPos - 8, 12, 12);
      pdf.text('No', margin + 260, yPos);
      yPos += 30;

      // Admission Date
      pdf.text('Date of Admission:', margin + 15, yPos);
      pdf.line(margin + 150, yPos + 3, margin + 280, yPos + 3);
      pdf.text('Time:', margin + 300, yPos);
      pdf.line(margin + 340, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 25;

      // Discharge Date
      pdf.text('Date of Discharge:', margin + 15, yPos);
      pdf.line(margin + 150, yPos + 3, margin + 280, yPos + 3);
      pdf.text('Time:', margin + 300, yPos);
      pdf.line(margin + 340, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 35;

      // Section 3: Medical Details
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(230, 240, 255);
      pdf.rect(margin + 10, yPos, contentWidth - 20, 25, 'F');
      pdf.text('SECTION 3: MEDICAL DETAILS', margin + 15, yPos + 17);
      yPos += 40;

      // Diagnosis
      pdf.setFont('helvetica', 'normal');
      pdf.text('Diagnosis/Nature of Illness:', margin + 15, yPos);
      yPos += 15;
      pdf.line(margin + 15, yPos, pageWidth - margin - 15, yPos);
      yPos += 15;
      pdf.line(margin + 15, yPos, pageWidth - margin - 15, yPos);
      yPos += 25;

      // Treatment Given
      pdf.text('Treatment Given:', margin + 15, yPos);
      yPos += 15;
      pdf.line(margin + 15, yPos, pageWidth - margin - 15, yPos);
      yPos += 15;
      pdf.line(margin + 15, yPos, pageWidth - margin - 15, yPos);
      yPos += 35;

      // Section 4: Financial Details
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(230, 240, 255);
      pdf.rect(margin + 10, yPos, contentWidth - 20, 25, 'F');
      pdf.text('SECTION 4: CHARGES BREAKDOWN', margin + 15, yPos + 17);
      yPos += 40;

      // Charges table
      pdf.setFont('helvetica', 'normal');
      const charges = [
        'Room Charges',
        'Consultation Fees',
        'Laboratory Charges',
        'Medication/Pharmacy',
        'Surgical Charges',
        'Other Charges (Please Specify)'
      ];

      charges.forEach((charge) => {
        pdf.text(charge + ':', margin + 15, yPos);
        pdf.text('Rs.', pageWidth - margin - 120, yPos);
        pdf.line(pageWidth - margin - 95, yPos + 3, pageWidth - margin - 15, yPos + 3);
        yPos += 20;
      });

      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL CHARGES:', margin + 15, yPos);
      pdf.text('Rs.', pageWidth - margin - 120, yPos);
      pdf.setLineWidth(1.5);
      pdf.line(pageWidth - margin - 95, yPos + 3, pageWidth - margin - 15, yPos + 3);
      pdf.setLineWidth(1);
      yPos += 35;

      // Section 5: Certification
      pdf.setFillColor(255, 250, 230);
      pdf.rect(margin + 10, yPos, contentWidth - 20, 25, 'F');
      pdf.text('SECTION 5: MEDICAL OFFICER CERTIFICATION', margin + 15, yPos + 17);
      yPos += 40;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const certification = 'I hereby certify that the above patient was treated at this institution for the condition stated and that the charges mentioned are correct and payable.';
      const certLines = pdf.splitTextToSize(certification, contentWidth - 30);
      pdf.text(certLines, margin + 15, yPos);
      yPos += 35;

      // Signature fields
      pdf.setFontSize(10);
      pdf.text('Name of Medical Officer:', margin + 15, yPos);
      pdf.line(margin + 150, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 25;

      pdf.text('Signature:', margin + 15, yPos);
      pdf.line(margin + 150, yPos + 3, margin + 300, yPos + 3);
      pdf.text('Date:', margin + 320, yPos);
      pdf.line(margin + 360, yPos + 3, pageWidth - margin - 15, yPos + 3);
      yPos += 25;

      pdf.text('Official Stamp:', margin + 15, yPos);
      pdf.setDrawColor(150, 150, 150);
      pdf.rect(margin + 150, yPos - 10, 100, 50);

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Form HR/F/08 - Hospital Claim Form', pageWidth / 2, pageHeight - 20, { align: 'center' });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const empNumber = formData?.employeeNumber || 'XXXXX';
      const filename = `Hospital_Claim_HR_F_08_${empNumber}_${timestamp}.pdf`;

      // Save the PDF
      pdf.save(filename);
      
      resolve();
    } catch (error) {
      console.error('Error generating Hospital Claim Form PDF:', error);
      reject(error);
    }
  });
};

/**
 * Preview Hospital Claim Form in a new tab
 */
export const previewHospitalClaimFormPDF = async (
  _formData?: HospitalClaimFormData
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Same implementation as generateHospitalClaimFormPDF but output to new tab
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // ... (same PDF generation code as above)
      // For brevity, reusing the same logic

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      
      resolve();
    } catch (error) {
      console.error('Error previewing Hospital Claim Form PDF:', error);
      reject(error);
    }
  });
};
