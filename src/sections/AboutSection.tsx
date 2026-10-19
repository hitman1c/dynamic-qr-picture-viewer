import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { revealDelay } from '../hooks/journey';

const benefits = [
  {
    icon: 'refresh',
    title: 'Stop paying for reprints',
    text: 'A price change or sold-out dish no longer means a new print run. Update the picture and the code on the wall stays valid.',
  },
  {
    icon: 'eye',
    title: 'Give customers the current version',
    text: 'No one has to squint at a faded poster or ask whether the menu is still accurate. The scan shows what is live right now.',
  },
  {
    icon: 'layers',
    title: 'Keep every poster separate',
    text: 'Different pictures get different codes, so a lunch menu, a promo and a directions card can each have their own address.',
  },
  {
    icon: 'users',
    title: 'Keep the customer experience simple',
    text: 'Customers do not download anything or create an account. The picture page is the whole experience.',
  },
] as const;

export default function AboutSection() {
  return (
    <section className="section" id="about" aria-labelledby="about-heading">
      <div className="section-glow" aria-hidden="true" />
      <div className="section-inner">
        <div className="section-head reveal" data-from="up">
          <p className="section-eyebrow">About the project</p>
          <h2 id="about-heading">A QR code should not expire with its picture.</h2>
          <p>
            The Dynamic QR Picture Viewer is a small web application with a straightforward purpose:
            let a business print one QR code and change the picture behind it whenever the
            information changes.
          </p>
        </div>

        <div className="split split-flow">
          <div className="split-copy reveal" data-from="left">
            <p className="section-eyebrow">The idea</p>
            <h3 className="subsection-title">One code, many pictures over time.</h3>
            <p>
              Most QR codes are generated from a fixed link. If the link points at a file that is
              later replaced, the code breaks. If it points at a page that never changes, the
              information goes stale.
            </p>
            <p>
              This project separates the two: the QR code points to a stable picture ID, and the
              dashboard changes which image that ID returns.
            </p>
            <Link className="text-link" to="/#how-it-works">
              See the full process
              <Icon name="arrow-right" />
            </Link>
          </div>

          <div className="about-panel reveal" data-from="right">
            <div className="note-card note-card-navy">
              <Icon name="spark" />
              <p>
                The project was created and built by Sechaba Seabata as a practical answer to a
                common small-business problem: information changes faster than printed material.
              </p>
            </div>
            <ul className="check-list">
              <li>
                <Icon name="check" />
                Owner publishes through a private dashboard
              </li>
              <li>
                <Icon name="check" />
                Customers scan and see the current picture
              </li>
              <li>
                <Icon name="check" />
                The printed code keeps its address
              </li>
            </ul>
          </div>
        </div>

        <div className="problem-grid">
          <article className="problem-card reveal" data-from="left">
            <span className="problem-label">The problem</span>
            <h3>Every change becomes a new print job.</h3>
            <ul className="plain-list">
              <li>Menus, price lists and promotional posters go out of date.</li>
              <li>Reprinting costs money and takes time.</li>
              <li>Old material lingers on walls and counters.</li>
              <li>Customers are left reading information that is no longer true.</li>
            </ul>
          </article>

          <article
            className="problem-card problem-card-solution reveal"
            data-from="right"
            style={revealDelay(120)}
          >
            <span className="problem-label">Our solution</span>
            <h3>One reusable code and a small dashboard.</h3>
            <ul className="plain-list">
              <li>Print the code once for the picture&apos;s stable address.</li>
              <li>Upload a replacement image when something changes.</li>
              <li>The next scan shows the new picture automatically.</li>
              <li>Keep running other pictures on their own codes.</li>
            </ul>
          </article>
        </div>

        <div className="mission-grid">
          <article className="mission-card reveal" data-from="up">
            <span className="icon-badge">
              <Icon name="target" />
            </span>
            <h3>Mission</h3>
            <p>
              Make it easy for businesses to share up-to-date visual information using one reusable
              QR code.
            </p>
          </article>
          <article className="mission-card reveal" data-from="up" style={revealDelay(120)}>
            <span className="icon-badge">
              <Icon name="eye" />
            </span>
            <h3>Vision</h3>
            <p>
              Help businesses communicate with their customers more conveniently, without repeatedly
              printing new materials.
            </p>
          </article>
        </div>

        <div className="card-grid">
          {benefits.map((benefit, index) => (
            <article
              className="info-card reveal"
              data-from={index % 2 === 0 ? 'left' : 'right'}
              style={revealDelay(index * 70)}
              key={benefit.title}
            >
              <span className="icon-badge">
                <Icon name={benefit.icon} />
              </span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>

        <div className="split split-flow">
          <div className="split-copy reveal" data-from="left">
            <p className="section-eyebrow">Under the hood</p>
            <h3 className="subsection-title">A deliberately small, modern stack.</h3>
            <p>
              The interface is a React 19 application written in TypeScript and built with Vite.
              Picture records live in Neon Postgres and are read through database functions. The site
              is deployed on Netlify with a single-page routing fallback.
            </p>
            <p>
              Uploads are resized and compressed in the browser before publishing, which keeps the
              flow quick and avoids sending oversized originals. QR codes are generated locally in
              the browser.
            </p>
          </div>

          <div className="tech-panel reveal" data-from="right">
            <ul className="tech-list">
              <li>
                <strong>Frontend</strong>
                React 19, TypeScript, Vite, CSS
              </li>
              <li>
                <strong>Data</strong>
                Neon Postgres with SQL functions
              </li>
              <li>
                <strong>QR codes</strong>
                qrcode.react, rendered in the browser
              </li>
              <li>
                <strong>Hosting</strong>
                Netlify with SPA redirects
              </li>
            </ul>
            <Link className="text-link" to="/#team">
              Meet the person behind it
              <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
