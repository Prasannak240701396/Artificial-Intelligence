type MessageCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Set<MessageCallback> = new Set();
  private isConnected: boolean = false;
  private reconnectInterval: number = 3000;

  public connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.notifyListeners({ type: 'STATUS', connected: true });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (e) {
          console.error('WS Parse Error:', e);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.notifyListeners({ type: 'STATUS', connected: false });
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.socket.onerror = () => {
        this.isConnected = false;
      };
    } catch (e) {
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  public subscribe(callback: MessageCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(data: any) {
    this.listeners.forEach((callback) => callback(data));
  }

  public getStatus(): boolean {
    return this.isConnected;
  }
}

export const wsService = new WebSocketService();
