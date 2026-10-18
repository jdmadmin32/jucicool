/**
 * Soft Copy Image Compressor for Product Management
 * 
 * Compresses uploaded product soft copy photos down to ~2KB
 * using client-side HTML5 Canvas and WebP/JPEG encoding.
 * Stored directly as base64 Data URL in database.
 * Deleting the product permanently removes the image from DB.
 */

export interface CompressedImageResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
  originalSizeKb: number;
}

export function formatKb(sizeKb: number): string {
  if (sizeKb < 1) {
    return `${Math.round(sizeKb * 1024)} B`;
  }
  return `${sizeKb.toFixed(1)} KB`;
}

/**
 * Compresses an image file down to ~2KB target.
 * Iteratively scales dimensions and quality until size is around 2KB.
 */
export async function compressImageTo2Kb(
  file: File,
  targetMaxKb: number = 3.0
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file (PNG, JPG, JPEG, WEBP)'));
      return;
    }

    const originalSizeKb = file.size / 1024;
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to process image data'));

      img.onload = () => {
        try {
          let maxDim = 220; // Starting max dimension (width or height)
          let quality = 0.72;
          let dataUrl = '';
          let sizeKb = 0;
          let finalW = 0;
          let finalH = 0;

          // Progressive refinement loop to achieve ~2KB target
          for (let attempt = 0; attempt < 8; attempt++) {
            let w = img.width;
            let h = img.height;

            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }

            finalW = Math.max(w, 30);
            finalH = Math.max(h, 30);

            const canvas = document.createElement('canvas');
            canvas.width = finalW;
            canvas.height = finalH;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error('Canvas context not available in browser'));
              return;
            }

            // Smooth image scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Clean white background for transparency conversion
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, finalW, finalH);
            ctx.drawImage(img, 0, 0, finalW, finalH);

            // Export to WebP (best compression) with fallback to JPEG
            try {
              dataUrl = canvas.toDataURL('image/webp', quality);
              if (!dataUrl.startsWith('data:image/webp')) {
                dataUrl = canvas.toDataURL('image/jpeg', quality);
              }
            } catch {
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }

            // Approximate binary size in KB from base64 length
            const base64Data = dataUrl.split(',')[1] || '';
            sizeKb = (base64Data.length * 0.75) / 1024;

            if (sizeKb <= targetMaxKb || maxDim <= 90 || quality <= 0.25) {
              break;
            }

            // Next step: reduce quality slightly, then scale down
            quality = Math.max(quality - 0.12, 0.25);
            maxDim = Math.round(maxDim * 0.82);
          }

          resolve({
            dataUrl,
            sizeKb: Number(sizeKb.toFixed(2)),
            width: finalW,
            height: finalH,
            originalSizeKb: Number(originalSizeKb.toFixed(2)),
          });
        } catch (err) {
          reject(err);
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
