import { createFreeWifiPosterDataUrl } from '../services/imageService';

const poster = createFreeWifiPosterDataUrl();

/**
 * Photographic-style product device: a phone tilted in perspective and held
 * by a lightly rim-lit hand, showing the built-in FREE WIFI demonstration
 * poster that the hero QR code opens.
 */
export default function PhoneInHand() {
  return (
    <div className="device-showcase" aria-label="Phone showing the FREE WIFI picture">
      <span className="device-halo" aria-hidden="true" />
      <span className="device-orbit device-orbit-a" aria-hidden="true" />
      <span className="device-orbit device-orbit-b" aria-hidden="true" />

      <div className="device-scene" role="img" aria-label="A hand holding a phone that displays a FREE WIFI poster">
        <div className="hand-forearm" aria-hidden="true" />
        <div className="hand-palm" aria-hidden="true" />
        <div className="hand-finger hand-finger-a" aria-hidden="true" />
        <div className="hand-finger hand-finger-b" aria-hidden="true" />
        <div className="hand-finger hand-finger-c" aria-hidden="true" />

        <div className="device-phone">
          <div className="device-screen">
            <img src={poster} alt="" aria-hidden="true" />
            <span className="device-glare" aria-hidden="true" />
            <div className="device-status" aria-hidden="true">
              <span>9:41</span>
              <span className="device-status-icons">
                <span className="device-signal" />
                <span className="device-battery" />
              </span>
            </div>
            <div className="device-appbar" aria-hidden="true">
              <span className="device-dot" />
              <span>qr-picture-viewer</span>
              <span className="device-live">LIVE</span>
            </div>
          </div>
        </div>

        <div className="hand-thumb" aria-hidden="true" />
      </div>

      <div className="device-caption">
        <span className="device-caption-dot" aria-hidden="true" />
        <span>FREE WIFI poster</span>
        <span className="device-caption-sep" aria-hidden="true" />
        <span className="device-caption-muted">scan the code to view</span>
      </div>
    </div>
  );
}
