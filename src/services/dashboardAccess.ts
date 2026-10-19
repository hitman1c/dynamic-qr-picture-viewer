export const PASSWORD_LENGTH = 9;

const UNLOCK_KEY = 'dqr:dashboard-unlocked';

export function isDashboardUnlocked(): boolean {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === 'yes';
  } catch {
    return false;
  }
}

export function unlockDashboard(): void {
  try {
    sessionStorage.setItem(UNLOCK_KEY, 'yes');
  } catch {
    // Storage can be unavailable in private mode; the gate would simply ask again.
  }
}

export function lockDashboard(): void {
  try {
    sessionStorage.removeItem(UNLOCK_KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}

export function getDashboardPassword(): string {
  return ((import.meta.env.VITE_DASHBOARD_PASSWORD as string | undefined) ?? '').trim();
}
