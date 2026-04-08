# Medical Claim Form PDF Generation - HR/F/07

## Overview
The Medical Claim Form PDF generation feature allows employees to download a filled PDF form with their medical claim details overlaid on the official HR/F/07 form template.

## Technical Implementation

### Components

#### 1. PDF Generator Utility (`medicalFormPdfGenerator.ts`)
Location: `frontend/src/utils/medicalFormPdfGenerator.ts`

**Key Features:**
- Uses jsPDF library for PDF generation
- Overlays text on official form template image
- Supports A4 paper size (595.28 × 841.89 pt)
- Auto-scales from template dimensions (1240 × 1754 px)
- Uses 12pt Helvetica font for all text fields

**Functions:**
1. `generateMedicalClaimPDF(formData, templatePath?)` - Downloads PDF
2. `previewMedicalClaimPDF(formData, templatePath?)` - Opens PDF in new tab

#### 2. Template Image
Location: `frontend/public/medical-form-template.jpg`
- Dimensions: 1240 × 1754 pixels
- Format: JPEG
- Usage: Background template for PDF generation

### Field Position Mapping

All positions are calibrated to match the official HR/F/07 form layout:

| Field Name | X (px) | Y (px) | Location |
|------------|--------|--------|----------|
| Employee Number | 720 | 122 | Top-right header |
| Division | 720 | 155 | Top-right header |
| Applicant Name | 530 | 215 | Row 1, right column |
| Marital Status | 530 | 250 | Row 2, right column |
| Patient Name | 530 | 295 | Row 3a, right column |
| Family Relationship | 530 | 330 | Row 3b, right column |
| Age | 530 | 365 | Row 3c, right column |
| Hospital/Pharmacy/Clinic | 530 | 400 | Row 4, right column |
| Doctor Name | 530 | 440 | Row 5, right column |
| Diagnosis | 530 | 475 | Row 6, right column |
| Treatment Date | 530 | 520 | Row 7, right column |
| Requested Amount | 530 | 560 | Row 8, right column |

### Data Formatting

The PDF generator automatically formats data:

1. **Dates**: Converted to DD/MM/YYYY format
2. **Amounts**: Formatted to 2 decimal places with "Rs." prefix
3. **Treatment Duration**: Appended to date if provided (e.g., "15/10/2025 (3 days)")
4. **Long Text**: Diagnosis field supports multi-line text wrapping

### Usage Example

```typescript
import { generateMedicalClaimPDF } from '@/utils/medicalFormPdfGenerator';

const formData = {
  employeeNumber: "EMP001",
  division: "IT Department",
  applicantName: "John Doe",
  maritalStatus: "Married",
  patientName: "Jane Doe",
  relationshipToApplicant: "Spouse",
  patientAge: 35,
  hospitalName: "General Hospital",
  doctorName: "Dr. Smith",
  diagnosis: "Fever and cold",
  treatmentDate: "2025-10-05",
  treatmentDuration: "3 days",
  requestedAmount: 5000.00,
  claimedAmount: 4500.00
};

// Generate and download PDF
await generateMedicalClaimPDF(formData);

// Or preview in new tab
await previewMedicalClaimPDF(formData);
```

## File Naming Convention

Generated PDFs follow this naming pattern:
```
Medical_Claim_HR_F_07_{EmployeeNumber}_{YYYYMMDD}.pdf
```

Example: `Medical_Claim_HR_F_07_EMP001_20251005.pdf`

## Dependencies

- **jsPDF** v2.x - PDF document generation library
- Template image must be accessible at `/medical-form-template.jpg`

## Error Handling

The PDF generator includes error handling for:
1. Template image loading failures
2. PDF generation errors
3. Invalid form data

Errors are logged to console and displayed to user via alert dialog.

## Browser Compatibility

Works in all modern browsers that support:
- Canvas API
- Blob API
- URL.createObjectURL()
- File download via anchor tags

## Testing Checklist

- [ ] All 14 fields appear in correct positions
- [ ] Text is legible at 12pt font size
- [ ] Dates formatted as DD/MM/YYYY
- [ ] Currency amounts show "Rs." prefix
- [ ] Multi-line diagnosis text wraps correctly
- [ ] PDF downloads with correct filename
- [ ] Template image loads successfully
- [ ] Error handling works for missing template

## Future Enhancements

Potential improvements:
1. Add digital signature support
2. Include QR code for verification
3. Support for multiple languages
4. Batch PDF generation for multiple claims
5. Email PDF directly to approvers
6. Save PDF to server along with submission

## Troubleshooting

### Issue: Template image not loading
**Solution**: Ensure `medical-form-template.jpg` exists in `frontend/public/` folder

### Issue: Text positions are off
**Solution**: Verify template dimensions are exactly 1240 × 1754 pixels

### Issue: PDF is blank
**Solution**: Check browser console for CORS errors or image loading issues

### Issue: Font too small/large
**Solution**: Adjust `pdf.setFontSize(12)` in the generator utility
