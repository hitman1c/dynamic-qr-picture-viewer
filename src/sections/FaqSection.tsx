import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { revealDelay } from '../hooks/journey';

const faqs = [
  {
    q: 'Do customers need to install an app?',
    a: 'No. The QR code opens a web page, so any modern phone camera and browser will do. There is nothing to download and nothing to keep open.',
  },
  {
    q: 'Do customers need an account?',
    a: 'No. The picture page is public by design. Only the owner uses a login, and that login is limited to the dashboard.',
  },
  {
    q: 'Can I update my picture without printing another QR code?',
    a: 'Yes. Select the picture in your dashboard library and use Replace selected picture (keep its QR). The printed code keeps pointing at the same address and shows the new image on the next scan.',
  },
  {
    q: 'Does each picture get its own QR code?',
    a: 'Yes. Publish as new QR code creates a brand new picture with its own address and its own code. That lets you run several posters at the same time, each updating independently.',
  },
  {
    q: 'Can I upload pictures from my phone?',
    a: 'Yes. The dashboard works in a mobile browser. JPEG, PNG, WebP and GIF files up to 15 MB are accepted and are resized in the browser before publishing.',
  },
  {
    q: 'Can I use a picture URL instead of uploading?',
    a: 'Yes. Paste a direct, public image address that starts with https:// and the app checks that it actually loads as an image before accepting it.',
  },
  {
    q: 'What happens when someone scans my QR code?',
    a: 'Their browser opens the public picture page for that code. The page loads the current image for that picture address, keeps its aspect ratio and shows a short updated timestamp. No dashboard or login is involved.',
  },
  {
    q: 'Can I use it for a business menu or price list?',
    a: 'That is the main use case. Menus, price lists, promotions, opening hours, directions and event schedules all work well because the picture can change while the printed code stays valid.',
  },
  {
    q: 'What happens if I lose access to the browser that created my picture?',
    a: 'Each picture carries an edit token that is stored in that browser. Without it you cannot replace that picture, although its public page and QR code keep working. If you lose the browser, either restore that browser profile or publish a new picture and print its new code. There is no account recovery yet.',
  },
  {
    q: 'Can I remove a picture?',
    a: 'Forget removes a picture from your dashboard list, but it does not delete the published record, so scanning its code still opens the picture. Deleting a published record is not exposed in the interface.',
  },
  {
    q: 'Is the dashboard password secure?',
    a: 'The password is a first line of defence and is not an account system. It is configured when the site is built, so it should be a unique value and not a password you use anywhere important. The public picture pages are intentionally open.',
  },
] as const;

export default function FaqSection() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-heading">
      <div className="section-glow" aria-hidden="true" />
      <div className="section-inner section-inner-narrow">
        <div className="section-head reveal" data-from="up">
          <p className="section-eyebrow">FAQ</p>
          <h2 id="faq-heading">Questions owners ask before printing.</h2>
          <p>
            Short answers about scanning, uploading, updating and access, based on how the viewer
            actually behaves today.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details
              className="faq-item reveal"
              data-from="up"
              style={revealDelay(Math.min(index, 5) * 50)}
              key={faq.q}
            >
              <summary>
                <span>{faq.q}</span>
                <Icon name="arrow-down" />
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="callout reveal" data-from="up">
          <Icon name="refresh" />
          <p>
            Still unsure? The full publishing flow is explained step by step in the{' '}
            <Link className="text-link" to="/#how-it-works">
              How it works
            </Link>{' '}
            section above.
          </p>
        </div>
      </div>
    </section>
  );
}
