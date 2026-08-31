/**
 * Client-Side File & Image Compression, Validation, and Optimization Engine
 * Supports automated downscaling, WebP/JPEG conversion, file validation, and secure encoding.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: "image/webp" | "image/jpeg" | "image/png";
  maxInputSizeMb?: number;
}

export interface OptimizationResult {
  dataUrl: string;
  fileName: string;
  fileType: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number; // percentage saved, e.g., 85
  width?: number;
  height?: number;
}

/**
 * Format bytes to readable string (e.g. 1.2 MB, 340 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Validates if the file matches expected accept types and maximum size limit.
 */
export function validateFile(
  file: File,
  allowedMimes: string[] = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "application/pdf"],
  maxSizeMb: number = 25
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  const fileSizeMb = file.size / (1024 * 1024);
  if (fileSizeMb > maxSizeMb) {
    return {
      valid: false,
      error: `File exceeds maximum allowed size of ${maxSizeMb} MB (Current: ${fileSizeMb.toFixed(1)} MB).`,
    };
  }

  // Check MIME type or extension
  const matchesMime = allowedMimes.some((mime) => {
    if (mime.endsWith("/*")) {
      const base = mime.split("/")[0];
      return file.type.startsWith(`${base}/`);
    }
    return file.type === mime || file.name.toLowerCase().endsWith(mime.replace("application/", "."));
  });

  if (!matchesMime && allowedMimes.length > 0) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type || file.name.split('.').pop()}). Please upload a valid format.`,
    };
  }

  return { valid: true };
}

/**
 * Compresses and optimizes an image file using browser Canvas with high-DPI preservation and aspect ratio constraint.
 */
export async function optimizeImage(
  file: File,
  options: CompressionOptions = {}
): Promise<OptimizationResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.84,
    format = "image/webp",
    maxInputSizeMb = 25,
  } = options;

  const validation = validateFile(
    file,
    ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"],
    maxInputSizeMb
  );

  if (!validation.valid) {
    throw new Error(validation.error || "Invalid image file");
  }

  // SVGs and GIFs don't require raster canvas downscaling to preserve vector / animation
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          dataUrl,
          fileName: file.name,
          fileType: file.type,
          originalSize: file.size,
          optimizedSize: file.size,
          compressionRatio: 0,
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale dimensions while keeping aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error("Could not initialize 2D rendering canvas context");
          }

          // Fill transparent background for JPEG conversion
          if (format === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to optimized format (WebP by default for maximum compression)
          let outputFormat = format;
          // Verify browser supports WebP canvas export, fallback to JPEG if needed
          const testDataUrl = canvas.toDataURL("image/webp", 0.8);
          if (!testDataUrl.startsWith("data:image/webp")) {
            outputFormat = "image/jpeg";
          }

          const dataUrl = canvas.toDataURL(outputFormat, quality);
          // Estimate byte size from base64 string
          const stringLength = dataUrl.length - dataUrl.indexOf(",") - 1;
          const optimizedSize = Math.round((stringLength * 3) / 4);

          const compressionRatio =
            file.size > optimizedSize
              ? Math.round(((file.size - optimizedSize) / file.size) * 100)
              : 0;

          resolve({
            dataUrl,
            fileName: file.name.replace(/\.[^/.]+$/, "") + (outputFormat === "image/webp" ? ".webp" : ".jpg"),
            fileType: outputFormat,
            originalSize: file.size,
            optimizedSize,
            compressionRatio,
            width,
            height,
          });
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("Failed to decode image data"));
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Reads a non-image document file (PDF, Word, Excel, etc.) and returns base64 dataUrl + metadata.
 */
export async function optimizeDocument(
  file: File,
  maxSizeMb: number = 15
): Promise<OptimizationResult> {
  const validation = validateFile(
    file,
    [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
      "application/zip",
      "application/x-zip-compressed",
    ],
    maxSizeMb
  );

  if (!validation.valid) {
    throw new Error(validation.error || "Invalid document file");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        dataUrl: reader.result as string,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        originalSize: file.size,
        optimizedSize: file.size,
        compressionRatio: 0,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
