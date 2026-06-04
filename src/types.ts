export interface PDFFile {
  id: string;
  name: string;
  size: number;
  file: File;
  totalPages?: number;
  pageNames?: string[];
}

export interface ImageFile {
  id: string;
  name: string;
  size: number;
  file: File;
  previewUrl: string;
}

export type ToolCategory = 'Organize' | 'Page Options' | 'Content Edit' | 'Creation' | 'Security' | 'Convert To' | 'Convert From';

export interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  accentClass: string;
  badge?: string;
}
