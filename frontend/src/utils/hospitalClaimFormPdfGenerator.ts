/**
 * Interface for Hospital Claim Form HR/F/08 data
 */
export interface HospitalClaimFormData {
  employeeNumber?: string;
  patientName?: string;
  // Additional fields can be added as needed
}

/**
 * Download the original Hospital Claim Form PDF (HR/F/08)
 * 
 * This form is the official SLBFE form meant to be filled manually 
 * by hospital/clinic staff or the employee with hospital details and signatures.
 * 
 * @param formData - Optional data (not used currently as we download the blank form)
 * @returns Promise that resolves when PDF is downloaded
 */
export const generateHospitalClaimFormPDF = async (
  _formData?: HospitalClaimFormData
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Path to the original HR/F/08 form in the public folder
      const pdfPath = '/HR-F-08-Hospital-Claim-Form.pdf';
      
      // Create a link element to trigger download
      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = 'HR-F-08-Hospital-Claim-Form.pdf';
      link.target = '_blank';
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('HR/F/08 Hospital Claim Form downloaded successfully');
      resolve();
    } catch (error) {
      console.error('Error downloading Hospital Claim Form PDF:', error);
      reject(error);
    }
  });
};

/**
 * Preview Hospital Claim Form in a new tab
 * Opens the original HR/F/08 form PDF in a new browser tab
 */
export const previewHospitalClaimFormPDF = async (
  _formData?: HospitalClaimFormData
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Path to the original HR/F/08 form in the public folder
      const pdfPath = '/HR-F-08-Hospital-Claim-Form.pdf';
      
      // Open in new tab
      window.open(pdfPath, '_blank');
      
      console.log('HR/F/08 Hospital Claim Form opened in new tab');
      resolve();
    } catch (error) {
      console.error('Error previewing Hospital Claim Form PDF:', error);
      reject(error);
    }
  });
};

