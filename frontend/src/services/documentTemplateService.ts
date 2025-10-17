// Document Template Service - Mock implementation for demo

import { DocumentTemplate, DocumentTemplateStats, GeneratedDocument } from '../types';

class DocumentTemplateService {
  private templates: DocumentTemplate[] = [];
  private generatedDocuments: GeneratedDocument[] = [];

  // Mock API methods
  async getTemplates(): Promise<DocumentTemplate[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.templates;
  }

  async getTemplate(id: string): Promise<DocumentTemplate | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.templates.find(t => t.id === id) || null;
  }

  async createTemplate(templateData: Partial<DocumentTemplate>): Promise<DocumentTemplate> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTemplate: DocumentTemplate = {
      id: Date.now().toString(),
      name: templateData.name || '',
      description: templateData.description || '',
      category: templateData.category || 'other',
      fileType: templateData.fileType || 'docx',
      template: templateData.template || '',
      placeholders: templateData.placeholders || [],
      isActive: templateData.isActive ?? true,
      isDefault: templateData.isDefault ?? false,
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin@slbfe.lk',
      lastModifiedBy: 'admin@slbfe.lk',
      usage: { totalUsed: 0 },
      approvalRequired: templateData.approvalRequired ?? false,
      tags: templateData.tags || []
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: string, templateData: Partial<DocumentTemplate>): Promise<DocumentTemplate> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }

    const updatedTemplate: DocumentTemplate = {
      ...this.templates[index],
      ...templateData,
      updatedAt: new Date(),
      lastModifiedBy: 'admin@slbfe.lk'
    };

    this.templates[index] = updatedTemplate;
    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }

    this.templates.splice(index, 1);
  }

  async duplicateTemplate(id: string): Promise<DocumentTemplate> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const original = this.templates.find(t => t.id === id);
    if (!original) {
      throw new Error('Template not found');
    }

    const duplicated: DocumentTemplate = {
      ...original,
      id: Date.now().toString(),
      name: `${original.name} (Copy)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      usage: { totalUsed: 0 }
    };

    this.templates.push(duplicated);
    return duplicated;
  }

  async uploadTemplateFile(file: File): Promise<string> {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would upload to cloud storage
    // and return the file URL/path
    return `/templates/${Date.now()}_${file.name}`;
  }

  async generateDocument(templateId: string, placeholderValues: Record<string, any>): Promise<GeneratedDocument> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const document: GeneratedDocument = {
      id: Date.now().toString(),
      templateId: template.id,
      templateName: template.name,
      generatedFor: placeholderValues.employee_name || 'Unknown',
      generatedBy: 'admin@slbfe.lk',
      generatedAt: new Date(),
      filePath: `/documents/generated/${Date.now()}_${template.name}.${template.fileType}`,
      fileName: `${template.name}_${Date.now()}.${template.fileType}`,
      fileSize: Math.floor(Math.random() * 50000) + 10000, // Random size
      placeholderValues,
      status: 'final',
      downloadCount: 0
    };

    this.generatedDocuments.push(document);
    
    // Update template usage
    template.usage.totalUsed++;
    template.usage.lastUsed = new Date();

    return document;
  }

  async getGeneratedDocuments(): Promise<GeneratedDocument[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.generatedDocuments.sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }

  async getTemplateStats(): Promise<DocumentTemplateStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalTemplates = this.templates.length;
    const activeTemplates = this.templates.filter(t => t.isActive).length;
    
    const categoryBreakdown = this.templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ensure all categories are present
    const allCategories = [
      'employment_letters', 'leave_letters', 'transfer_letters', 'medical_letters',
      'salary_letters', 'retirement_letters', 'disciplinary_letters', 'training_certificates',
      'general_correspondence', 'forms', 'reports', 'policies', 'other'
    ];
    
    allCategories.forEach(category => {
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = 0;
      }
    });

    const recentlyUsed = this.templates
      .filter(t => t.usage.lastUsed)
      .sort((a, b) => new Date(b.usage.lastUsed!).getTime() - new Date(a.usage.lastUsed!).getTime())
      .slice(0, 5);

    const mostUsed = this.templates
      .sort((a, b) => b.usage.totalUsed - a.usage.totalUsed)
      .slice(0, 5);

    const totalDocumentsGenerated = this.generatedDocuments.length;
    const currentMonth = new Date();
    const documentsGeneratedThisMonth = this.generatedDocuments.filter(doc => {
      const docDate = new Date(doc.generatedAt);
      return docDate.getMonth() === currentMonth.getMonth() && 
             docDate.getFullYear() === currentMonth.getFullYear();
    }).length;

    return {
      totalTemplates,
      activeTemplates,
      categoryBreakdown: categoryBreakdown as any,
      recentlyUsed,
      mostUsed,
      totalDocumentsGenerated,
      documentsGeneratedThisMonth
    };
  }
}

export const documentTemplateService = new DocumentTemplateService();