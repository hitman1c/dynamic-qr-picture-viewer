import { Navigate } from 'react-router-dom';

interface SectionRedirectProps {
  section: string;
}

/**
 * Keeps the old, shareable marketing paths working after the site became one
 * continuous scroll journey: /features, /about, /team, /how-it-works and /faq
 * now land on the matching section of the home page.
 */
export default function SectionRedirect({ section }: SectionRedirectProps) {
  return <Navigate to={`/#${section}`} replace />;
}
