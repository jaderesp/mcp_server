// src/mcp/WebSocketServerTransport.ts
import { ServerTransport } from "./ServerTransport";

export class WebSocketServerTransport implements ServerTransport {
    private socket: WebSocket;

    constructor(socket: WebSocket) {
        this.socket = socket;

        this.socket.addEventListener("message", (event) => {
            if (event.data) {
                this.onMessage?.(event.data);
            }
        });

        this.socket.addEventListener("close", () => {
            this.onClose?.();
        });

        this.socket.addEventListener("error", () => {
            this.onClose?.();
        });
    }

    onMessage?: (message: string) => void;
    onClose?: () => void;

    async send(message: string): Promise<void> {
        this.socket.send(message);
    }

    async close(): Promise<void> {
        this.socket.close();
    }
}
