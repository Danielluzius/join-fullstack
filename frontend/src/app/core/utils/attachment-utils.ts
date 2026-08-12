import { TaskAttachment } from '../interfaces/board-tasks-interface';

const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.8;
const MAX_TOTAL_BYTES = 1_048_576;
const MAX_FILES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

/**
 * Validates file type and total attachment size limit.
 * Returns an error string or null if valid.
 */
export function validateAttachment(file: File, current: TaskAttachment[]): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'This file format is not allowed! You can only upload JPEG and PNG.';
  }
  if (current.length >= MAX_FILES) {
    return `You can upload a maximum of ${MAX_FILES} files per task.`;
  }
  return null;
}

/**
 * Checks whether the total base64 size of all attachments exceeds 1 MB.
 * Returns an error string or null if within limit.
 */
export function validateTotalSize(attachments: TaskAttachment[]): string | null {
  const totalBytes = attachments.reduce((sum, a) => sum + a.size, 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    return 'Total file size exceeds 1 MB. Please remove some files.';
  }
  return null;
}

/**
 * Compresses an image File to max 800x800px and converts it to a Base64 string.
 * Returns a TaskAttachment with name, type, size and base64 data.
 */
export function compressAndEncode(file: File): Promise<TaskAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => processImageData(e, file, resolve, reject);
    reader.readAsDataURL(file);
  });
}

/** Loads the image from the FileReader result and triggers canvas compression. */
function processImageData(
  e: ProgressEvent<FileReader>,
  file: File,
  resolve: (a: TaskAttachment) => void,
  reject: (err: unknown) => void,
): void {
  const img = new Image();
  img.onerror = reject;
  img.onload = () => drawAndResolve(img, file, resolve);
  img.src = e.target?.result as string;
}

/** Draws the image on a canvas scaled to max 800px and resolves with the attachment. */
function drawAndResolve(
  img: HTMLImageElement,
  file: File,
  resolve: (a: TaskAttachment) => void,
): void {
  const { width, height } = calcDimensions(img.width, img.height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
  const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  resolve({ name: file.name, type: file.type, size: base64.length, base64 });
}

/**
 * Calculates new dimensions keeping aspect ratio within MAX_DIMENSION.
 * Returns original dimensions if already within limit.
 */
function calcDimensions(w: number, h: number): { width: number; height: number } {
  if (w <= MAX_DIMENSION && h <= MAX_DIMENSION) return { width: w, height: h };
  const ratio = Math.min(MAX_DIMENSION / w, MAX_DIMENSION / h);
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}
