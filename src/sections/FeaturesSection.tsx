import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { revealDelay } from '../hooks/journey';

const features = [
  {
    icon: 'qr',
    title: 'One permanent QR code',
    text: 'Print a code for a table, a door or a poster. Because the code points to a stable picture address, it keeps working after the image changes.',
  },
  {
    icon: 'refresh',
    title: 'Update without reprinting',
    text: 'Replace the picture behind an existing code from the dashboard. The printed code stays the same and shows the new picture on the next scan.',
  },
  {
    icon: 'layers',
    title: 'A separate code for every picture',
    text: 'Publishing a new picture creates its own picture ID and QR code. Run a lunch menu and an evening menu side by side, each with its own code.',
  },
  {
    icon: 'upload',
    title: 'Upload or link a picture',
    text: 'Choose a JPEG, PNG, WebP or GIF up to 15 MB. Images are resized in the browser before publishing. You can also paste a public image URL.',
  },
  {
    icon: 'users',
    title: 'No app or account for viewers',
    text: 'Customers scan the code and the current picture opens in their browser. They never see the dashboard and never need to sign in.',
  },
  {
    icon: 'map',
    title: 'Made for everyday business',
    text: 'Use it for menus, price lists, promotions, opening hours, directions, event schedules, product sheets and contact cards.',
  },
] as const;

const uses = [
  {
    icon: 'menu',
    title: 'Restaurants and cafes',
    text: 'A menu that changes with the season, the day or what is left in the kitchen.',
  },
  {
    icon: 'target',
    title: 'Promotions and specials',
    text: "Swap a poster for this week's offer without touching the printed code.",
  },
  {
    icon: 'map',
    title: 'Directions and hours',
    text: 'A simple map card or opening-hours graphic for visitors and delivery drivers.',
  },
  {
    icon: 'layers',
    title: 'Product and price lists',
    text: 'Keep a current price sheet on the counter while the old code stays on the shelf.',
  },
] as const;

export default function FeaturesSection() {
  return (
    <section className="section" id="features" aria-labelledby="features-heading">
      <div className="section-glow" aria-hidden="true" />
      <div className="section-inner">
        <div className="section-head reveal" data-from="up">
          <p className="section-eyebrow">Features</p>
          <h2 id="features-heading">A QR code that grows with your business.</h2>
          <p>
            Everything in the viewer is built around one idea: the code is permanent, the picture is
            not. Owners get a private dashboard. Customers get a fast, simple picture page.
          </p>
        </div>

        <div className="card-grid">
          {features.map((feature, index) => (
            <article
              className="info-card reveal"
              data-from={index % 2 === 0 ? 'left' : 'right'}
              style={revealDelay(index * 70)}
              key={feature.title}
            >
              <span className="icon-badge">
                <Icon name={feature.icon} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>

        <div className="subsection reveal" data-from="up">
          <div className="section-head">
            <p className="section-eyebrow">Common uses</p>
            <h3 className="subsection-title">One small tool, many shop windows.</h3>
          </div>
          <div className="card-grid card-grid-tight">
            {uses.map((item, index) => (
              <article
                className="use-card reveal"
                data-from="right"
                style={revealDelay(index * 60)}
                key={item.title}
              >
                <span className="icon-badge icon-badge-sm">
                  <Icon name={item.icon} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="split split-flow reveal" data-from="up">
          <div className="split-copy">
            <p className="section-eyebrow">How ownership works</p>
            <h3 className="subsection-title">Public to view. Private to change.</h3>
            <p>
              Every picture record carries an edit token that is kept in the browser that created it.
              Publishing or replacing a picture requires that token; viewing a picture does not. The
              dashboard sits behind an owner password as well, so casual visitors cannot reach the
              management screens.
            </p>
            <p>
              Clearing the browser data for this site removes those tokens. The public pages keep
              working, but that browser can no longer replace those pictures.
            </p>
            <Link className="text-link" to="/#faq">
              Read the access and recovery questions
              <Icon name="arrow-right" />
            </Link>
          </div>

          <div className="about-panel">
            <ul className="check-list">
              <li>
                <Icon name="lock" />
                Dashboard protected by an owner password
              </li>
              <li>
                <Icon name="eye" />
                Picture pages open without a login
              </li>
              <li>
                <Icon name="refresh" />
                Replacements keep the existing code alive
              </li>
              <li>
                <Icon name="check" />
                Invalid image types and oversized files are rejected
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
