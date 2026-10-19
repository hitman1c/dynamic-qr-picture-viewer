export interface TeamLink {
  label: string;
  href: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  contributions: string[];
  photoUrl?: string;
  links: TeamLink[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'creator',
    name: 'Sechaba Seabata',
    role: 'Project creator and developer',
    bio: 'I created the Dynamic QR Picture Viewer around one practical idea: a printed QR code should not go out of date just because the picture behind it changed. I built the project end to end, from the dashboard and public viewing page to the database functions and deployment.',
    skills: [
      'React',
      'TypeScript',
      'Vite',
      'CSS',
      'Neon Postgres',
      'Netlify',
      'Testing and accessibility',
    ],
    contributions: [
      'Product idea, scope and the reusable-QR concept',
      'Interface and layout design for the dashboard and public pages',
      'Frontend development with React, TypeScript and Vite',
      'Neon Postgres schema, database functions and edit-token ownership',
      'QR code generation, password protection and browser testing',
      'Deployment, documentation and ongoing improvements',
    ],
    links: [
      { label: 'GitHub profile', href: 'https://github.com/hitman1c' },
      {
        label: 'Project repository',
        href: 'https://github.com/hitman1c/dynamic-qr-picture-viewer',
      },
    ],
  },
];
