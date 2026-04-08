import jsPDF from 'jspdf';

/**
 * Interface for medical claim   // R  relationshipToApplicant: { x: 605, y: 376 }, // Row 3b: Relationship field
  patientAge: { x: 605, y: 416 },          // Row 3c: Age number field
  
  // Row 3: Hospital/Clinic info (3 sub-rows)
  hospitalName: { x: 605, y: 460 },        // Row 4: Medical facility
  doctorName: { x: 605, y: 502 },          // Row 5: Doctor's name
  diagnosis: { x: 605, y: 542 },           // Row 6: Diagnosis/Illness
  
  // Row 4: Treatment date and duration
  treatmentDate: { x: 605, y: 592 },       // Row 7: Treatment date
  
  // Row 5: Amount
  requestedAmount: { x: 605, y: 638 },     // Row 8: Amount requestedospital/Clinic info (3 sub-rows)
  hospitalName: { x: 605, y: 460 },        // Row 4: Medical facility
  doctorName: { x: 605, y: 502 },          // Row 5: Doctor's name
  diagnosis: { x: 605, y: 542 },           // Row 6: Diagnosis/Illness: Hospital/Clinic info (3 sub-rows)
  hospitalName: { x: 605, y: 460 },        // Row 4: Medical facility
  doctorName: { x: 605, y: 502 },          // Row 5: Doctor's name
  diagnosis: { x: 605, y: 542 },           // Row 6: Diagnosis/Illness
  
  // Row 4: Treatment date and duration
  treatmentDate: { x: 605, y: 592 },       // Row 7: Treatment dateta
 */
export interface MedicalClaimFormData {
  employeeNumber: string;
  division: string;
  applicantName: string;
  maritalStatus: string;
  patientName: string;
  relationshipToApplicant: string;
  patientAge: number;
  hospitalName: string;
  doctorName: string;
  diagnosis: string;
  treatmentDate: string;
  treatmentDuration?: string;
  requestedAmount: number;
  claimedAmount?: number;
  availableAmount?: number;
}

/**
 * Field position mapping based on the medical form template
 * Template dimensions: 1414px × 2000px
 * 
 * Converting pixel coordinates to PDF points (pt):
 * PDF standard: 72 DPI, A4 page in portrait: 595.28 × 841.89 pt
 * We'll use a scale factor to fit the 1414×2000 template onto A4
 */
const TEMPLATE_WIDTH_PX = 1414;
const TEMPLATE_HEIGHT_PX = 2000;
const PDF_WIDTH_PT = 595.28; // A4 width in points
const PDF_HEIGHT_PT = 841.89; // A4 height in points

// Scale factors to convert pixel positions to PDF points
const SCALE_X = PDF_WIDTH_PT / TEMPLATE_WIDTH_PX;
const SCALE_Y = PDF_HEIGHT_PT / TEMPLATE_HEIGHT_PX;

/**
 * Field positions in pixels (corrected based on actual form layout)
 * Will be converted to PDF points using scale factors
 * 
 * Note: Y positions are measured from top of page
 * Form has 8 numbered rows with right column for data entry
 */
const FIELD_POSITIONS = {
  // Top-right header table
  employeeNumber: { x: 1117, y: 219 },      // Top-right header box
  division: { x: 1117, y: 262 },            // Top-right header box, below employee number
  
  // Main applicant info (top section before numbered rows)
  applicantName: { x: 812, y: 367 },       // Row 1: Full name field
  maritalStatus: { x: 812, y: 428 },       // Row 2: Marital status
  
  // Row 1: Patient name
  patientName: { x: 812, y: 492 },         // Row 3a: Patient name
  
  // Row 2: Relationship and Age (same row)
  relationshipToApplicant: { x: 812, y: 539 }, // Row 3b: Relationship field
  patientAge: { x: 812, y: 590 },          // Row 3c: Age number field
  
  // Row 3: Hospital/Clinic info (3 sub-rows)
  hospitalName: { x: 812, y: 656 },        // Row 4: Medical facility
  doctorName: { x: 812, y: 709 },          // Row 5: Doctor's name
  diagnosis: { x: 812, y: 766 },           // Row 6: Diagnosis/Illness

  // Row 4: Treatment date and duration
  treatmentDate: { x: 812, y: 832 },       // Row 7: Treatment date

  // Row 5: Amount
  requestedAmount: { x: 812, y: 899 },     // Row 8: Amount requested
  
  // Financial section
  claimedAmount: { x: 664, y: 1369 },       // Financial section - left box
  availableAmount: { x: 664, y: 1419 }     // Financial section - full width box
};

/**
 * Convert pixel coordinates to PDF points
 */
const toPdfCoordinates = (xPx: number, yPx: number): { x: number; y: number } => {
  return {
    x: xPx * SCALE_X,
    y: yPx * SCALE_Y
  };
};

/**
 * Format date to DD/MM/YYYY format
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format currency amount
 */
const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

/**
 * Generate Medical Claim Form PDF (HR/F/07)
 * 
 * @param formData - The medical claim form data
 * @param templateImagePath - Path to the form template image (default: /medical-form-template.jpg)
 * @returns Promise that resolves when PDF is generated and downloaded
 */
export const generateMedicalClaimPDF = async (
  formData: MedicalClaimFormData,
  templateImagePath: string = '/medical-form-template.jpg'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create new PDF document (A4 size, portrait)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Load the template image
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        try {
          // Add template image as background (fill entire page)
          pdf.addImage(
            img,
            'JPEG',
            0,
            0,
            PDF_WIDTH_PT,
            PDF_HEIGHT_PT,
            undefined,
            'FAST'
          );

          // Set font properties
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0); // Black text

          // Add text fields at their respective positions
          
          // Employee Number (top-right header box)
          const empNumPos = toPdfCoordinates(FIELD_POSITIONS.employeeNumber.x, FIELD_POSITIONS.employeeNumber.y);
          pdf.text(formData.employeeNumber, empNumPos.x, empNumPos.y);

          // Division (top-right header box, below employee number)
          const divisionPos = toPdfCoordinates(FIELD_POSITIONS.division.x, FIELD_POSITIONS.division.y);
          pdf.text(formData.division, divisionPos.x, divisionPos.y);

          // Applicant Name (Row 1, right column)
          const applicantPos = toPdfCoordinates(FIELD_POSITIONS.applicantName.x, FIELD_POSITIONS.applicantName.y);
          pdf.text(formData.applicantName, applicantPos.x, applicantPos.y);

          // Marital Status (Row 2, right column)
          const maritalPos = toPdfCoordinates(FIELD_POSITIONS.maritalStatus.x, FIELD_POSITIONS.maritalStatus.y);
          pdf.text(formData.maritalStatus, maritalPos.x, maritalPos.y);

          // Patient Name (Row 3a, right column)
          const patientPos = toPdfCoordinates(FIELD_POSITIONS.patientName.x, FIELD_POSITIONS.patientName.y);
          pdf.text(formData.patientName, patientPos.x, patientPos.y);

          // Family Relationship (Row 3b, right column)
          const relationPos = toPdfCoordinates(FIELD_POSITIONS.relationshipToApplicant.x, FIELD_POSITIONS.relationshipToApplicant.y);
          pdf.text(formData.relationshipToApplicant, relationPos.x, relationPos.y);

          // Age (Row 3c, right column)
          const agePos = toPdfCoordinates(FIELD_POSITIONS.patientAge.x, FIELD_POSITIONS.patientAge.y);
          pdf.text(formData.patientAge.toString(), agePos.x, agePos.y);

          // Hospital/Pharmacy/Clinic (Row 4, right column)
          const hospitalPos = toPdfCoordinates(FIELD_POSITIONS.hospitalName.x, FIELD_POSITIONS.hospitalName.y);
          pdf.text(formData.hospitalName, hospitalPos.x, hospitalPos.y);

          // Doctor Name (Row 5, right column)
          const doctorPos = toPdfCoordinates(FIELD_POSITIONS.doctorName.x, FIELD_POSITIONS.doctorName.y);
          pdf.text(formData.doctorName, doctorPos.x, doctorPos.y);

          // Diagnosis (Row 6, right column)
          const diagnosisPos = toPdfCoordinates(FIELD_POSITIONS.diagnosis.x, FIELD_POSITIONS.diagnosis.y);
          // Split diagnosis into multiple lines if it's too long (max ~50 chars per line)
          const diagnosisLines = pdf.splitTextToSize(formData.diagnosis, 325 * SCALE_X);
          pdf.text(diagnosisLines, diagnosisPos.x, diagnosisPos.y);

          // Treatment Date (Row 7, right column)
          const datePos = toPdfCoordinates(FIELD_POSITIONS.treatmentDate.x, FIELD_POSITIONS.treatmentDate.y);
          const formattedDate = formatDate(formData.treatmentDate);
          const dateText = formData.treatmentDuration 
            ? `${formattedDate} (${formData.treatmentDuration})`
            : formattedDate;
          pdf.text(dateText, datePos.x, datePos.y);

          // Requested Amount (Row 8, right column - larger field)
          const amountPos = toPdfCoordinates(FIELD_POSITIONS.requestedAmount.x, FIELD_POSITIONS.requestedAmount.y);
          const amountText = `Rs. ${formatAmount(formData.requestedAmount)}`;
          pdf.text(amountText, amountPos.x, amountPos.y);

          // Claimed Amount (Financial section)
          if (formData.claimedAmount !== undefined) {
            const claimedPos = toPdfCoordinates(FIELD_POSITIONS.claimedAmount.x, FIELD_POSITIONS.claimedAmount.y);
            const claimedText = `Rs. ${formatAmount(formData.claimedAmount)}`;
            pdf.text(claimedText, claimedPos.x, claimedPos.y);
          }

          // Available Amount (Financial section)
          if (formData.availableAmount !== undefined) {
            const availablePos = toPdfCoordinates(FIELD_POSITIONS.availableAmount.x, FIELD_POSITIONS.availableAmount.y);
            const availableText = `Rs. ${formatAmount(formData.availableAmount)}`;
            pdf.text(availableText, availablePos.x, availablePos.y);
          }

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          const filename = `Medical_Claim_HR_F_07_${formData.employeeNumber}_${timestamp}.pdf`;

          // Save the PDF
          pdf.save(filename);
          
          resolve();
        } catch (error) {
          console.error('Error generating PDF:', error);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error('Error loading template image:', error);
        reject(new Error('Failed to load form template image. Please ensure medical-form-template.jpg exists in the public folder.'));
      };

      // Start loading the image
      img.src = templateImagePath;

    } catch (error) {
      console.error('Error initializing PDF generation:', error);
      reject(error);
    }
  });
};

/**
 * Generate and preview PDF in a new tab (instead of downloading)
 */
export const previewMedicalClaimPDF = async (
  formData: MedicalClaimFormData,
  templateImagePath: string = '/medical-form-template.jpg'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        try {
          // Add template and text (same as generateMedicalClaimPDF)
          pdf.addImage(img, 'JPEG', 0, 0, PDF_WIDTH_PT, PDF_HEIGHT_PT, undefined, 'FAST');
          
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);

          // Add all fields (same logic as above)
          const empNumPos = toPdfCoordinates(FIELD_POSITIONS.employeeNumber.x, FIELD_POSITIONS.employeeNumber.y);
          pdf.text(formData.employeeNumber, empNumPos.x, empNumPos.y);

          const divisionPos = toPdfCoordinates(FIELD_POSITIONS.division.x, FIELD_POSITIONS.division.y);
          pdf.text(formData.division, divisionPos.x, divisionPos.y);

          const applicantPos = toPdfCoordinates(FIELD_POSITIONS.applicantName.x, FIELD_POSITIONS.applicantName.y);
          pdf.text(formData.applicantName, applicantPos.x, applicantPos.y);

          const maritalPos = toPdfCoordinates(FIELD_POSITIONS.maritalStatus.x, FIELD_POSITIONS.maritalStatus.y);
          pdf.text(formData.maritalStatus, maritalPos.x, maritalPos.y);

          const patientPos = toPdfCoordinates(FIELD_POSITIONS.patientName.x, FIELD_POSITIONS.patientName.y);
          pdf.text(formData.patientName, patientPos.x, patientPos.y);

          const relationPos = toPdfCoordinates(FIELD_POSITIONS.relationshipToApplicant.x, FIELD_POSITIONS.relationshipToApplicant.y);
          pdf.text(formData.relationshipToApplicant, relationPos.x, relationPos.y);

          const agePos = toPdfCoordinates(FIELD_POSITIONS.patientAge.x, FIELD_POSITIONS.patientAge.y);
          pdf.text(formData.patientAge.toString(), agePos.x, agePos.y);

          const hospitalPos = toPdfCoordinates(FIELD_POSITIONS.hospitalName.x, FIELD_POSITIONS.hospitalName.y);
          pdf.text(formData.hospitalName, hospitalPos.x, hospitalPos.y);

          const doctorPos = toPdfCoordinates(FIELD_POSITIONS.doctorName.x, FIELD_POSITIONS.doctorName.y);
          pdf.text(formData.doctorName, doctorPos.x, doctorPos.y);

          const diagnosisPos = toPdfCoordinates(FIELD_POSITIONS.diagnosis.x, FIELD_POSITIONS.diagnosis.y);
          const diagnosisLines = pdf.splitTextToSize(formData.diagnosis, 325 * SCALE_X);
          pdf.text(diagnosisLines, diagnosisPos.x, diagnosisPos.y);

          const datePos = toPdfCoordinates(FIELD_POSITIONS.treatmentDate.x, FIELD_POSITIONS.treatmentDate.y);
          const formattedDate = formatDate(formData.treatmentDate);
          const dateText = formData.treatmentDuration 
            ? `${formattedDate} (${formData.treatmentDuration})`
            : formattedDate;
          pdf.text(dateText, datePos.x, datePos.y);

          const amountPos = toPdfCoordinates(FIELD_POSITIONS.requestedAmount.x, FIELD_POSITIONS.requestedAmount.y);
          const amountText = `Rs. ${formatAmount(formData.requestedAmount)}`;
          pdf.text(amountText, amountPos.x, amountPos.y);

          // Claimed Amount (Financial section)
          if (formData.claimedAmount !== undefined) {
            const claimedPos = toPdfCoordinates(FIELD_POSITIONS.claimedAmount.x, FIELD_POSITIONS.claimedAmount.y);
            const claimedText = `Rs. ${formatAmount(formData.claimedAmount)}`;
            pdf.text(claimedText, claimedPos.x, claimedPos.y);
          }

          // Available Amount (Financial section)
          if (formData.availableAmount !== undefined) {
            const availablePos = toPdfCoordinates(FIELD_POSITIONS.availableAmount.x, FIELD_POSITIONS.availableAmount.y);
            const availableText = `Rs. ${formatAmount(formData.availableAmount)}`;
            pdf.text(availableText, availablePos.x, availablePos.y);
          }

          // Open in new tab instead of downloading
          const pdfBlob = pdf.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');
          
          resolve();
        } catch (error) {
          console.error('Error previewing PDF:', error);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error('Error loading template image:', error);
        reject(new Error('Failed to load form template image.'));
      };

      img.src = templateImagePath;

    } catch (error) {
      console.error('Error initializing PDF preview:', error);
      reject(error);
    }
  });
};
