import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { revealDelay } from '../hooks/journey';
import DemoShowcase from './DemoShowcase';

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
    title: 'Shops, salons and lodges',
    text: 'Price lists, opening hours, directions and room cards that stay current.',
  },
  {
    icon: 'layers',
    title: 'Events and small business',
    text: 'Schedules, product sheets and contact cards — one code, always the latest version.',
  },
] as const;

export default function FeaturesSection() {
  return (
    <section className="section" id="features" aria-labelledby="features-heading">
      <div className="section-glow" aria-hidden="true" />
      <div className="section-inner">
        <div className="section-head reveal" data-from="up">
          <p className="section-eyebrow">The problem</p>
          <h2 id="features-heading">Still reprinting every update?</h2>
          <p>
            Menus change. Promotions end. Prices go up. Every reprint costs time and money — and
            the old code on yesterday&apos;s poster does not magically point at the new version.
          </p>
        </div>

        <div className="problem-strip reveal" data-from="up" aria-hidden="true">
          <div className="problem-card is-old">
            <span className="problem-tag">Old way</span>
            <p>Print → scan → update → reprint → repeat</p>
          </div>
          <span className="problem-arrow">
            <Icon name="arrow-right" />
          </span>
          <div className="problem-card is-new">
            <span className="problem-tag">Picture Viewer</span>
            <p>Print once → update the picture → same code forever</p>
          </div>
        </div>

        <DemoShowcase />

        <div className="subsection reveal" data-from="up">
          <div className="section-head">
            <p className="section-eyebrow">The possibilities</p>
            <h3 className="subsection-title">Made for everyday business.</h3>
          </div>
          <div className="uses-asymmetric">
            {uses.map((item, index) => (
              <article
                className={
                  index % 2 === 0 ? 'use-card use-card-wide reveal' : 'use-card reveal'
                }
                data-from={index % 2 === 0 ? 'left' : 'right'}
                style={revealDelay(index * 70)}
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

        <div className="split split-flow reveal" data-from="up">
          <div className="split-copy">
            <p className="section-eyebrow">How ownership works</p>
            <h3 className="subsection-title">Public to view. Private to change.</h3>
            <p>
              Every picture record carries an edit token that is kept in the browser that created
              it. Publishing or replacing a picture requires that token; viewing a picture does
              not. The dashboard sits behind an owner password as well, so casual visitors cannot
              reach the management screens.
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
