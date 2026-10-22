import { useRef, useState } from 'react';
import type { PictureSource } from '../../types/picture';
import {
  acceptedTypeLabel,
  fileToOptimizedDataUrl,
  validateImageUrl,
} from '../../services/imageService';
import { IconUpload, IconWifi } from './icons';

interface StudioPickerProps {
  onImage: (imageUrl: string, source: PictureSource, label: string) => void;
  onError: (message: string) => void;
  onUsePoster: () => void;
  busy: boolean;
}

export default function StudioPicker({ onImage, onError, onUsePoster, busy }: StudioPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlValue, setUrlValue] = useState('');
  const [validating, setValidating] = useState(false);
  const [readingFile, setReadingFile] = useState(false);
  const [dragging, setDragging] = useState(false);

  const working = validating || readingFile || busy;

  async function acceptFile(file: File | null | undefined) {
    if (!file) return;
    setReadingFile(true);
    try {
      const dataUrl = await fileToOptimizedDataUrl(file);
      onImage(dataUrl, 'upload', file.name || 'Uploaded picture');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'The file could not be read.');
    } finally {
      setReadingFile(false);
    }
  }

  async function handleUrlSubmit(event: React.FormEvent) {
    event.preventDefault();
    setValidating(true);
    try {
      const url = await validateImageUrl(urlValue);
      onImage(url, 'url', 'Image link');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'The URL could not be used.');
    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="studio-picker">
      <div
        className={dragging ? 'studio-dropzone is-dragging' : 'studio-dropzone'}
        onDragOver={(event) => {
          event.preventDefault();
          if (!working) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (working) return;
          void acceptFile(event.dataTransfer.files?.[0]);
        }}
      >
        <input
          ref={fileInputRef}
          id="studio-file"
          className="visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            void acceptFile(file);
          }}
        />
        <button
          type="button"
          className="studio-dropzone-btn"
          disabled={working}
          onClick={() => fileInputRef.current?.click()}
        >
          <IconUpload size={22} />
          <span className="studio-dropzone-title">
            {readingFile ? 'Preparing picture…' : 'Drop a picture here or choose a file'}
          </span>
          <span className="studio-dropzone-hint">
            {acceptedTypeLabel()}, up to 15&nbsp;MB
          </span>
        </button>
      </div>

      <form className="studio-picker-url" onSubmit={handleUrlSubmit}>
        <label className="field-label" htmlFor="studio-url">
          Or paste an image link
        </label>
        <div className="url-row">
          <input
            id="studio-url"
            type="url"
            inputMode="url"
            placeholder="https://example.com/picture.jpg"
            value={urlValue}
            onChange={(event) => setUrlValue(event.target.value)}
            disabled={working}
          />
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={working || urlValue.trim().length === 0}
          >
            {validating ? 'Checking…' : 'Use link'}
          </button>
        </div>
      </form>

      <button
        type="button"
        className="btn btn-ghost"
        onClick={onUsePoster}
        disabled={working}
      >
        <IconWifi /> Use the FREE WIFI poster
      </button>
    </div>
  );
}
