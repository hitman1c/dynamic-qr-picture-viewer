import { useRef, useState } from 'react';
import type { PictureSource } from '../types/picture';
import { acceptedTypeLabel, fileToOptimizedDataUrl, validateImageUrl } from '../services/imageService';

interface ImageUploaderProps {
  onImage: (imageUrl: string, source: PictureSource) => void;
  onError: (message: string) => void;
}

export default function ImageUploader({ onImage, onError }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlValue, setUrlValue] = useState('');
  const [validating, setValidating] = useState(false);
  const [readingFile, setReadingFile] = useState(false);

  const busy = validating || readingFile;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setReadingFile(true);
    try {
      const dataUrl = await fileToOptimizedDataUrl(file);
      onImage(dataUrl, 'upload');
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
      onImage(url, 'url');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'The URL could not be used.');
    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="uploader">
      <fieldset className="uploader-block" disabled={busy}>
        <legend>Upload from this device</legend>
        <p className="hint">
          Your photo is optimized in the browser and published to the picture service.{' '}
          {acceptedTypeLabel()}, up to 15&nbsp;MB.
        </p>
        <input
          ref={fileInputRef}
          id="picture-file"
          className="visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          {readingFile ? 'Preparing image…' : 'Choose picture…'}
        </button>
      </fieldset>

      <fieldset className="uploader-block" disabled={busy}>
        <legend>Or use an image URL</legend>
        <label className="field-label" htmlFor="picture-url">
          Direct image address
        </label>
        <div className="url-row">
          <input
            id="picture-url"
            type="url"
            inputMode="url"
            placeholder="https://example.com/picture.jpg"
            value={urlValue}
            onChange={(event) => setUrlValue(event.target.value)}
          />
          <button type="button" className="btn btn-secondary" onClick={handleUrlSubmit}>
            {validating ? 'Checking…' : 'Use URL'}
          </button>
        </div>
      </fieldset>
    </div>
  );
}
