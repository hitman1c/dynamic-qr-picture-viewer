import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { getDemoPictures } from '../site/sampleContent';
import { demoViewUrl } from '../site/demo';
import { revealDelay } from '../hooks/journey';

const DEMO_URL = demoViewUrl();

export default function StorySection() {
  const pictures = useMemo(() => getDemoPictures(), []);
  const [active, setActive] = useState(0);
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);

  const scenes = useMemo(() => {
    const image = (id: string) =>
      pictures.find((picture) => picture.id === id)?.imageUrl ?? pictures[0].imageUrl;

    return [
      {
        step: '01',
        tag: 'Print once',
        title: 'The code goes on the table and stays there.',
        copy: 'Print one QR code for the counter, the door or the poster. It points at a stable picture address, not at a file that will be replaced.',
        caption: 'FREE WIFI poster — the built-in demo picture.',
        imageUrl: image('wifi'),
      },
      {
        step: '02',
        tag: 'No reprint',
        title: 'The menu changes. The code does not.',
        copy: 'When the lunch menu changes, update the picture in the dashboard. The printed code keeps its address and shows the new image on the next scan.',
        caption: 'The same code now shows the new lunch menu.',
        imageUrl: image('menu'),
      },
      {
        step: '03',
        tag: 'Live update',
        title: 'A new offer appears without touching the print.',
        copy: 'Launch a promotion, change a price or correct a detail. Visitors see the current picture, not yesterday’s printed copy.',
        caption: 'A promotion swapped in while the QR code stays identical.',
        imageUrl: image('promo'),
      },
      {
        step: '04',
        tag: 'Stay current',
        title: 'One permanent link for everything customers need.',
        copy: 'Price lists, opening hours, directions and event details can all move forward while every printed code remains valid.',
        caption: 'Updated rates, same permanent QR code.',
        imageUrl: image('prices'),
      },
    ];
  }, [pictures]);

  useEffect(() => {
    const nodes = sceneRefs.current.filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight * 0.5;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      nodes.forEach((node, index) => {
        const box = node.getBoundingClientRect();
        const center = box.top + box.height / 2;
        const distance = Math.abs(center - middle);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });
      setActive(nearest);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="story" id="why" data-progress aria-labelledby="why-heading">
      <span className="story-glow" aria-hidden="true" />
      <div className="story-shell">
        <div className="story-flow">
          <div className="story-intro reveal" data-from="up">
            <p className="section-eyebrow">Why QR Picture Viewer</p>
            <h2 id="why-heading">One code that outlives the picture.</h2>
            <p>
              Printed material goes stale. A single permanent code fixes that: the picture behind it
              changes, the code in front of your customer never does.
            </p>
          </div>

          <div className="story-scenes">
            {scenes.map((scene, index) => (
              <article
                key={scene.step}
                ref={(node) => {
                  sceneRefs.current[index] = node;
                }}
                className={index === active ? 'story-scene is-active' : 'story-scene'}
                aria-current={index === active ? 'step' : undefined}
              >
                <span className="story-step">{scene.step}</span>
                <span className="story-tag">{scene.tag}</span>
                <h3>{scene.title}</h3>
                <p>{scene.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="story-stage">
          <div className="story-stage-inner reveal" data-from="scale" style={revealDelay(120)}>
            <div className="story-phone" aria-hidden="true">
              <div className="story-phone-screen">
                {scenes.map((scene, index) => (
                  <img
                    key={scene.step}
                    src={scene.imageUrl}
                    alt=""
                    className={index === active ? 'story-phone-img is-active' : 'story-phone-img'}
                  />
                ))}
                <span className="story-phone-glare" />
                <div className="story-phone-bar">
                  <span>qr-picture-viewer</span>
                  <span className="story-phone-live">LIVE</span>
                </div>
              </div>
            </div>

            <div className="story-qr-card">
              <QRCodeCanvas
                value={DEMO_URL}
                size={116}
                level="M"
                marginSize={2}
                bgColor="#ffffff"
                fgColor="#0b1626"
              />
              <p>
                Same code.
                <br />
                New picture.
              </p>
            </div>

            <p className="story-stage-caption" role="status" aria-live="polite">
              {scenes[active].caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
