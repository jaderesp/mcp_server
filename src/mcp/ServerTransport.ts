// src/mcp/ServerTransport.ts
export interface ServerTransport {
    onMessage?: (message: string) => void;
    onClose?: () => void;
    send(message: string): Promise<void>;
    close(): Promise<void>;
}
