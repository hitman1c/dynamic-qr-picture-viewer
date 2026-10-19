import Icon from '../components/Icon';
import { teamMembers } from '../data/team';
import { revealDelay } from '../hooks/journey';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

const responsibilities = [
  {
    icon: 'spark',
    title: 'Idea and product direction',
    text: 'Defining the reusable-QR concept and deciding what the first useful version should do.',
  },
  {
    icon: 'layers',
    title: 'Interface design',
    text: 'Designing the dashboard flow, the public picture page and this website.',
  },
  {
    icon: 'qr',
    title: 'Frontend and QR codes',
    text: 'Building the React application, the upload flow and the downloadable QR codes.',
  },
  {
    icon: 'lock',
    title: 'Data and access',
    text: 'Setting up the Neon database functions, edit tokens and password-protected dashboard.',
  },
  {
    icon: 'check',
    title: 'Testing and deployment',
    text: 'Checking the publishing flow across devices and deploying the site on Netlify.',
  },
] as const;

export default function TeamSection() {
  return (
    <section className="section section-soft" id="team" aria-labelledby="team-heading">
      <div className="section-glow" aria-hidden="true" />
      <div className="section-inner">
        <div className="section-head reveal" data-from="up">
          <p className="section-eyebrow">Meet the team</p>
          <h2 id="team-heading">A solo project, built end to end.</h2>
          <p>
            The Dynamic QR Picture Viewer was designed and built by one person. The profile below lists
            the real contributor and what they actually did, and it can be maintained in one data file.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <article
              className="team-card reveal"
              data-from={index % 2 === 0 ? 'left' : 'right'}
              style={revealDelay(index * 110)}
              key={member.id}
            >
              <div className="team-head">
                <div className="team-photo" aria-hidden={!member.photoUrl ? true : undefined}>
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={`Portrait of ${member.name}`} />
                  ) : (
                    <span>{initials(member.name)}</span>
                  )}
                </div>
                <div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              </div>

              <p className="team-bio">{member.bio}</p>

              {member.skills.length > 0 && (
                <ul className="tag-list" aria-label={`${member.name} skills`}>
                  {member.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              )}

              {member.contributions.length > 0 && (
                <div className="team-block">
                  <h4>Contribution</h4>
                  <ul className="plain-list">
                    {member.contributions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {member.links.length > 0 && (
                <div className="team-links">
                  {member.links.map((link) => (
                    <a
                      key={link.href}
                      className="text-link"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                      <Icon name="arrow-right" />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="section-head subsection reveal" data-from="up">
          <p className="section-eyebrow">How we worked</p>
          <h3 className="subsection-title">One person, several hats.</h3>
          <p>
            Rather than inventing separate team members for every task, these are the
            responsibilities handled by the creator on this project.
          </p>
        </div>

        <div className="roles-grid">
          {responsibilities.map((item, index) => (
            <article
              className="role-card reveal"
              data-from="up"
              style={revealDelay(index * 60)}
              key={item.title}
            >
              <span className="icon-badge icon-badge-sm">
                <Icon name={item.icon} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <p className="role-owner">Sechaba Seabata</p>
              </div>
            </article>
          ))}
        </div>

        <div className="message-card reveal" data-from="scale">
          <span className="icon-badge icon-badge-light">
            <Icon name="spark" />
          </span>
          <div>
            <p className="section-eyebrow light">A message from the team</p>
            <h2>We want the tool to stay small enough to understand and useful enough to keep.</h2>
            <p>
              The goal is not to build another dashboard with dozens of settings. It is to make one
              job effortless: publish a picture, print its code, and change the picture later
              without confusing the people who scan it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
