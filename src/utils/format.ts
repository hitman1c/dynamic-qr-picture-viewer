export function formatDate(value: string): string {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return 'recently';
  return new Date(time).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
