import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import PhoneMockup from '../components/PhoneMockup';
import { revealDelay } from '../hooks/journey';

const steps = [
  {
    title: 'Open the dashboard',
    text: 'Choose any Get Started or Login button and enter the owner password. The dashboard is the only place where pictures are managed, and customers never see it.',
  },
  {
    title: 'Choose a picture',
    text: 'Upload a photo from your phone or computer, paste a public image URL, or start with the built-in FREE WIFI poster. Uploaded images are resized and compressed in the browser before publishing.',
  },
  {
    title: 'Publish and download the QR code',
    text: 'Publish the picture to create its own address, then download the QR code as a PNG. Print it, add it to a poster, or share the link directly.',
  },
  {
    title: 'Update whenever necessary',
    text: 'Select the picture in your library and replace it to keep its QR code working. Use Publish as new when you want a completely separate code instead.',
  },
] as const;

export default function HowItWorksSection() {
  return (
    <section className="section section-soft" id="how-it-works" aria-labelledby="steps-heading">
      <div className="section-glow" aria-hidden="true" />
      <div className="section-inner">
        <div className="section-head reveal" data-from="up">
          <p className="section-eyebrow">How it works</p>
          <h2 id="steps-heading">Publish once, scan forever.</h2>
          <p>
            Two sides to the viewer: a private dashboard for the owner and a public picture page for
            anyone who scans. Here is the full flow from first upload to a printed code.
          </p>
        </div>

        <ol className="steps steps-flow">
          {steps.map((step, index) => (
            <li
              className="step reveal"
              data-from={index % 2 === 0 ? 'right' : 'left'}
              style={revealDelay(index * 90)}
              key={step.title}
            >
              <span className="step-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="callout reveal" data-from="up">
          <Icon name="lock" />
          <p>
            Keep the browser you publish with. Each picture&apos;s edit token is stored there, so
            clearing site data removes your ability to replace those pictures later.
          </p>
        </div>

        <div className="split split-center split-flow" data-progress>
          <div className="split-copy reveal" data-from="left">
            <p className="section-eyebrow">What visitors see</p>
            <h3 className="subsection-title">One page, one picture, no distractions.</h3>
            <p>
              Scanning the code opens a public page at a stable address. It loads the current picture
              for that address, keeps the original aspect ratio and adds nothing else &mdash; no
              navigation, no account prompts and no dashboard controls.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="eye" />
                Works in any modern phone browser
              </li>
              <li>
                <Icon name="refresh" />
                Shows the newest picture on every scan
              </li>
              <li>
                <Icon name="check" />
                Friendly message with a retry option if a picture is missing
              </li>
            </ul>
            <Link className="text-link" to="/#faq">
              Common questions
              <Icon name="arrow-right" />
            </Link>
          </div>

          <div className="how-visual reveal" data-from="right">
            <PhoneMockup showSign={false} />
          </div>
        </div>

        <div className="section-head subsection reveal" data-from="up">
          <p className="section-eyebrow">The important part</p>
          <h3 className="subsection-title">Replace the picture, keep the code.</h3>
          <p>
            This is what makes the viewer different from a plain image link. The QR code never
            contains the image itself, only the picture address.
          </p>
        </div>

        <div className="compare-grid">
          <article className="compare-card reveal" data-from="left">
            <span className="compare-label">A plain image link</span>
            <p className="compare-code">/menu-march.jpg</p>
            <p className="compare-note">Changes to the file break the code or show stale content.</p>
          </article>

          <article className="compare-card compare-card-good reveal" data-from="right">
            <span className="compare-label">A picture address</span>
            <p className="compare-code">/view/8f3c12d4</p>
            <p className="compare-note">
              The same code always resolves to whatever picture the owner published last.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
