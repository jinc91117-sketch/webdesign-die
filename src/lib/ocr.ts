import { recognize } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import type { UploadResult } from './types';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export async function extractTextFromFile(file: File, language: string): Promise<UploadResult> {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return extractTextFromPdf(file, language);
  }

  const text = await recognizeImage(file, language);
  return { text };
}

async function recognizeImage(image: File | HTMLCanvasElement, language: string): Promise<string> {
  const result = await recognize(image, language);
  return result.data.text.trim();
}

async function extractTextFromPdf(file: File, language: string): Promise<UploadResult> {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const texts: string[] = [];
  const pagesToRead = Math.min(pdf.numPages, 3);

  for (let pageNumber = 1; pageNumber <= pagesToRead; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.8 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      continue;
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const pageText = await recognizeImage(canvas, language);
    texts.push(`Page ${pageNumber}\n${pageText}`);
  }

  return {
    text: texts.join('\n\n').trim(),
    pageCount: pdf.numPages
  };
}
