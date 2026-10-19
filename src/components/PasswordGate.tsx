import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PASSWORD_LENGTH,
  getDashboardPassword,
  unlockDashboard,
} from '../services/dashboardAccess';

interface PasswordGateProps {
  onUnlock: () => void;
}

export default function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entered = password.trim();
    const expected = getDashboardPassword();

    if (entered.length === 0) {
      setError('Enter the dashboard password.');
      return;
    }
    if (entered.length !== PASSWORD_LENGTH) {
      setError(`The password must be exactly ${PASSWORD_LENGTH} characters.`);
      return;
    }
    if (expected.length === 0) {
      setError('No dashboard password is configured. Set VITE_DASHBOARD_PASSWORD (see README).');
      return;
    }
    if (entered !== expected) {
      setError('Incorrect password. Please try again.');
      return;
    }

    unlockDashboard();
    setError(null);
    setPassword('');
    onUnlock();
  }

  return (
    <div className="gate-page">
      <section className="card gate-card" aria-labelledby="gate-heading">
        <h1 id="gate-heading">Dynamic QR Picture Viewer</h1>
        <p className="hint">
          This dashboard is private. Enter the password to manage the published picture. People who
          scan your QR code never see this page &mdash; they go straight to the picture.
        </p>
        <form className="gate-form" onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="dashboard-password">
            Password
          </label>
          <input
            id="dashboard-password"
            type="password"
            autoComplete="current-password"
            maxLength={PASSWORD_LENGTH}
            value={password}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'gate-error' : 'gate-help'}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError(null);
            }}
          />
          <p className="hint" id="gate-help">
            {PASSWORD_LENGTH} characters, no username needed.
          </p>
          {error && (
            <p className="status-line status-error" id="gate-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary btn-block">
            Unlock dashboard
          </button>
        </form>
        <p className="hint">
          Just here to look around?{' '}
          <Link className="text-link-inline" to="/">
            Back to the website
          </Link>
        </p>
      </section>
    </div>
  );
}
