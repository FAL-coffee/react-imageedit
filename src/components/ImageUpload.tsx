import React, { useState } from 'react';

export interface ImageUploadProps {
  /**
   * 画像がアップロードされたときのコールバック
   */
  onImageUpload: (imageDataUrl: string) => void;
  
  /**
   * 不透明度が変更されたときのコールバック
   */
  onOpacityChange: (opacity: number) => void;
  
  /**
   * 現在の不透明度
   */
  opacity: number;
  
  /**
   * 最大ファイルサイズ（バイト単位）
   */
  maxFileSize?: number;
  
  /**
   * 追加のCSSクラス
   */
  className?: string;
}

/**
 * 画像アップロードコンポーネント
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onOpacityChange,
  opacity,
  maxFileSize = 5 * 1024 * 1024, // デフォルトは5MB
  className = '',
}) => {
  const [error, setError] = useState<string | null>(null);

  /**
   * 画像ファイルが選択されたときの処理
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズのチェック
      if (file.size > maxFileSize) {
        setError(`ファイルサイズは${Math.floor(maxFileSize / 1024 / 1024)}MB以下にしてください。`);
        return;
      }

      // FileReaderを使用してファイルを読み込む
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onImageUpload(event.target.result);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`mb-4 space-y-4 ${className}`}>
      <div>
        <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
          画像
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={() => document.getElementById('image-upload')?.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          画像をアップロード
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      
      <div>
        <label htmlFor="image-opacity" className="block text-sm font-medium mb-2">
          透明度: {opacity}%
        </label>
        <input
          type="range"
          id="image-opacity"
          min="0"
          max="100"
          step="1"
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ImageUpload;