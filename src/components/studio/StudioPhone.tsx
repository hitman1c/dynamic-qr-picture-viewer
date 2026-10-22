interface StudioPhoneProps {
  imageUrl?: string;
  alt: string;
  draft?: boolean;
  glowing?: boolean;
}

export default function StudioPhone({ imageUrl, alt, draft, glowing }: StudioPhoneProps) {
  return (
    <div
      className={glowing ? 'studio-phone is-glowing' : 'studio-phone'}
      aria-hidden="true"
    >
      <div className="studio-phone-notch" />
      <div className="studio-phone-screen">
        <div className="studio-phone-bar">
          <span>your-picture</span>
          <span className={draft ? 'studio-phone-live is-draft' : 'studio-phone-live'}>
            {draft ? 'DRAFT' : 'LIVE'}
          </span>
        </div>
        {imageUrl ? (
          <img
            key={imageUrl}
            className={draft ? 'studio-phone-img is-draft' : 'studio-phone-img'}
            src={imageUrl}
            alt={alt}
          />
        ) : (
          <div className="studio-phone-empty">
            <span>No picture yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
