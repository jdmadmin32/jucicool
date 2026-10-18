import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, Check, RefreshCw } from 'lucide-react';
import { compressImageTo2Kb, formatKb } from '../../utils/imageCompressor';

interface SinglePhotoUploadProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (dataUrl: string) => void;
  required?: boolean;
}

export const SinglePhotoUpload: React.FC<SinglePhotoUploadProps> = ({
  label,
  sublabel,
  value,
  onChange,
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);
  const [sizeInfo, setSizeInfo] = useState<string | null>(() => {
    if (value && value.startsWith('data:')) {
      const base64Len = value.split(',')[1]?.length || 0;
      return formatKb((base64Len * 0.75) / 1024);
    }
    return null;
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const result = await compressImageTo2Kb(file, 3.0);
      onChange(result.dataUrl);
      setSizeInfo(`${formatKb(result.sizeKb)} (compressed from ${formatKb(result.originalSizeKb)})`);
    } catch (err: any) {
      alert('Error processing photo: ' + (err.message || 'Compression failed'));
    } finally {
      setCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSizeInfo(null);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#183D2B]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {sublabel && <span className="text-[10px] text-[#68756B]">{sublabel}</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative group border border-[#E6EBDD] bg-[#FFFEF7] rounded-2xl p-2.5 flex items-center gap-3 transition-all hover:border-[#138443]">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl border border-[#E6EBDD] p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
            <img
              src={value}
              alt="Product soft copy"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#183D2B]">
              <Check className="w-3.5 h-3.5 text-[#138443]" />
              <span>Soft Copy Attached</span>
            </div>
            <div className="text-[11px] text-[#138443] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#138443]"></span>
              <span>{sizeInfo || 'Stored directly in database (~2KB)'}</span>
            </div>
            <p className="text-[10px] text-[#68756B]">
              Saved in DB. Deleting this product automatically removes it.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              type="button"
              disabled={compressing}
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-[11px] font-bold text-[#138443] bg-[#138443]/10 hover:bg-[#138443]/20 rounded-lg transition-colors flex items-center gap-1"
              title="Replace this photo"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-2.5 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
              title="Remove this photo"
            >
              <X className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onClick={() => !compressing && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-[#E6EBDD] hover:border-[#138443] bg-[#FBFDF9] hover:bg-[#F4F8F0] rounded-2xl p-4 text-center cursor-pointer transition-all ${
            compressing ? 'opacity-60 cursor-wait' : ''
          }`}
        >
          {compressing ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-1">
              <Loader2 className="w-6 h-6 text-[#138443] animate-spin" />
              <span className="text-xs font-bold text-[#183D2B]">Compressing photo to ~2KB...</span>
              <span className="text-[10px] text-[#68756B]">Optimizing for ultra-fast database storage</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="p-2 bg-[#138443]/10 text-[#138443] rounded-xl mb-0.5">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#183D2B]">
                Click to add soft copy photo
              </div>
              <p className="text-[10px] text-[#68756B]">
                JPG, PNG, WEBP • Auto-compressed to ~2KB & stored in DB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface MultiPhotoUploadProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
}

export const MultiPhotoUpload: React.FC<MultiPhotoUploadProps> = ({
  label,
  images,
  onChange,
}) => {
  const multiInputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setCompressing(true);
    const newCompressed: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const result = await compressImageTo2Kb(file, 3.0);
          newCompressed.push(result.dataUrl);
        }
      }
      onChange([...images, ...newCompressed]);
    } catch (err: any) {
      alert('Error compressing photos: ' + (err.message || 'Upload failed'));
    } finally {
      setCompressing(false);
      if (multiInputRef.current) {
        multiInputRef.current.value = '';
      }
    }
  };

  const handleRemoveIndex = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="p-3 bg-[#F8FAF5] rounded-2xl border border-[#E6EBDD] space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="font-bold text-xs text-[#183D2B] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#138443]" />
            <span>{label} ({images.length})</span>
          </label>
          <p className="text-[10px] text-[#68756B]">
            Soft copy gallery photos • Auto-compressed to ~2KB each
          </p>
        </div>

        <button
          type="button"
          disabled={compressing}
          onClick={() => multiInputRef.current?.click()}
          className="px-2.5 py-1.5 bg-[#138443] hover:bg-[#0d6131] text-white rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50"
        >
          {compressing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Compressing...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>+ Add Soft Copy Photos</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={multiInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFiles}
        className="hidden"
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group bg-white p-1.5 rounded-xl border border-[#E6EBDD] flex flex-col items-center shadow-xs"
            >
              <div className="w-full h-16 rounded-lg bg-[#F8FAF5] flex items-center justify-center overflow-hidden mb-1">
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full flex items-center justify-between text-[9px] text-[#68756B]">
                <span className="font-bold text-[#138443]">~2 KB in DB</span>
                <button
                  type="button"
                  onClick={() => handleRemoveIndex(idx)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete this photo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-[#68756B] py-1 text-center bg-white/60 rounded-xl border border-dashed border-[#E6EBDD]">
          No additional soft copy photos uploaded yet. Click "+ Add Soft Copy Photos" above.
        </p>
      )}
    </div>
  );
};
