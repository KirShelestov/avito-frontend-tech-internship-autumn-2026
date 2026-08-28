const rawApiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const rawWsUrl = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3000/api/v1/ws';

export const env = {
  apiUrl: rawApiUrl.replace(/\/$/, ''),
  wsUrl: rawWsUrl,
  useMsw: import.meta.env.VITE_USE_MSW === 'true',
  isDev: import.meta.env.DEV,
} as const;
