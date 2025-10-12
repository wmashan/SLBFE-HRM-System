import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const TrainingFeedbackForm = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    trainingSubject: '',
    trainingDate: '',
    trainingInstitute: '',
    objectiveClear: 0,
    contentRelevant: 0,
    presentationEffective: 0,
    materialsUseful: 0,
    additionalComments: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const ratingLabels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
  const ratingValues = [1, 2, 3, 4, 5];

  const questions = [
    {
      id: 'objectiveClear',
      text: 'The objective of the training program was clearly communicated.',
      field: 'objectiveClear'
    },
    {
      id: 'contentRelevant',
      text: 'Content of training program were relevant for your job role and responsibility.',
      field: 'contentRelevant'
    },
    {
      id: 'presentationEffective',
      text: 'The training was presented effectively and was easy to understand.',
      field: 'presentationEffective'
    },
    {
      id: 'materialsUseful',
      text: 'The training material/ method were relevant & useful.',
      field: 'materialsUseful'
    }
  ];

  const handleRatingChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all ratings are filled
    if (!formData.objectiveClear || !formData.contentRelevant || 
        !formData.presentationEffective || !formData.materialsUseful) {
      alert('Please rate all criteria before submitting');
      return;
    }

    // In real app, this would be an API call
    console.log('Feedback submitted:', {
      programId,
      ...formData,
      submittedDate: new Date().toISOString()
    });

    setIsSubmitted(true);
    
    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your feedback has been submitted successfully. Your input helps us improve our training programs.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Training Evaluation Sheet</h1>
              <div className="bg-white text-blue-700 px-3 py-1 rounded text-sm font-medium">
                HRF/26 (E)
              </div>
            </div>
            <p className="text-blue-100">Please provide your anonymous feedback to help us improve</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4 pb-6 border-b border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Training Subject
                </label>
                <Input
                  type="text"
                  value={formData.trainingSubject}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingSubject: e.target.value }))}
                  placeholder="Enter training subject"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Date
                </label>
                <Input
                  type="date"
                  value={formData.trainingDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingDate: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3. Training Institute
                </label>
                <Input
                  type="text"
                  value={formData.trainingInstitute}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingInstitute: e.target.value }))}
                  placeholder="Enter training institute name"
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Rating Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Please indicate your level of agreement with the following statements regarding the training program using the ✓ mark.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="px-2 py-1 bg-white rounded border border-gray-200">1 = Strongly Disagree</span>
                <span className="px-2 py-1 bg-white rounded border border-gray-200">2 = Disagree</span>
                <span className="px-2 py-1 bg-white rounded border border-gray-200">3 = Neutral</span>
                <span className="px-2 py-1 bg-white rounded border border-gray-200">4 = Agree</span>
                <span className="px-2 py-1 bg-white rounded border border-gray-200">5 = Strongly Agree</span>
              </div>
            </div>

            {/* Rating Questions */}
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    {index + 4}. {question.text}
                  </label>
                  
                  {/* Desktop View - Horizontal */}
                  <div className="hidden md:block">
                    <div className="flex items-center justify-between gap-2">
                      {ratingValues.map((value, idx) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleRatingChange(question.field, value)}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            formData[question.field as keyof typeof formData] === value
                              ? 'border-blue-600 bg-blue-50 shadow-md'
                              : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              formData[question.field as keyof typeof formData] === value
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-300 bg-white'
                            }`}>
                              {formData[question.field as keyof typeof formData] === value && (
                                <CheckCircle className="w-5 h-5 text-white fill-blue-600" />
                              )}
                            </div>
                            <span className="text-xs text-center font-medium text-gray-700">
                              {ratingLabels[idx]}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile View - Vertical */}
                  <div className="md:hidden space-y-2">
                    {ratingValues.map((value, idx) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingChange(question.field, value)}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          formData[question.field as keyof typeof formData] === value
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            formData[question.field as keyof typeof formData] === value
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {formData[question.field as keyof typeof formData] === value && (
                              <CheckCircle className="w-5 h-5 text-white fill-blue-600" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {ratingLabels[idx]}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Comments */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                8. Please provide any additional comment / suggestions to improve future training program.
              </label>
              <textarea
                value={formData.additionalComments}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalComments: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                rows={5}
                placeholder="Your comments and suggestions (optional)"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-3 text-base font-semibold"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit Feedback
              </Button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Your feedback is anonymous and will help us improve our training programs
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
              <span>DOC NO: HRF/26 (E)</span>
              <span>ISSUE NO: 01</span>
              <span>REVISION NO: 00</span>
              <span>DATE OF ISSUE: 19.07.2022</span>
              <span>PAGE 01 OF 01</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingFeedbackForm;
