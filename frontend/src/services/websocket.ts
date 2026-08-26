import type { MissionEvent } from '../types/mission';

function getWebSocketUrl(): string {
  // 1. Explicit Vite Environment Variable
  const envWs = import.meta.env.VITE_WS_URL;
  if (envWs && typeof envWs === 'string' && envWs.trim()) {
    return envWs.trim();
  }

  // 2. Derive from VITE_API_BASE_URL if configured
  const envApi = import.meta.env.VITE_API_BASE_URL;
  if (envApi && typeof envApi === 'string' && envApi.trim()) {
    const cleanApi = envApi.trim().replace(/\/$/, '');
    const wsProtocol = cleanApi.startsWith('https://') ? 'wss://' : 'ws://';
    const host = cleanApi.replace(/^https?:\/\//, '');
    return `${wsProtocol}${host}/ws/swarm-feed`;
  }

  // 3. Default Local Development
  return "ws://localhost:8000/ws/swarm-feed";
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: (event: MissionEvent) => void;
  private shouldReconnect: boolean = true;

  constructor(onMessage: (event: MissionEvent) => void) {
    this.url = getWebSocketUrl();
    this.onMessage = onMessage;
  }

  connect() {
    this.shouldReconnect = true;
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (e) {
          console.error("Failed to parse WS payload", e);
        }
      };

      this.ws.onclose = () => {
        if (this.shouldReconnect) {
          setTimeout(() => this.connect(), 2000);
        }
      };

      this.ws.onerror = () => {
        // Silently retry on reconnect
      };
    } catch {
      // Reconnect handled on timer
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }
}
