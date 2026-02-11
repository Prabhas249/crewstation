"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── OpenClaw Gateway WebSocket Connection ───────────────────────────
// Connects directly to your VPS Nginx → OpenClaw Gateway
// NOT through Vercel (Vercel can't hold long-lived WebSocket)

export type GatewayStatus = "disconnected" | "connecting" | "connected" | "error";

interface GatewayMessage {
  type: "req" | "res" | "event";
  id?: string;
  method?: string;
  params?: Record<string, unknown>;
  ok?: boolean;
  payload?: unknown;
  error?: unknown;
  event?: string;
  seq?: number;
}

interface UseGatewayOptions {
  url: string | null;
  token: string | null;
  onEvent?: (event: string, payload: unknown) => void;
}

export function useGateway({ url, token, onEvent }: UseGatewayOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reqIdRef = useRef(0);
  const pendingRef = useRef<Map<string, { resolve: (v: unknown) => void; reject: (e: unknown) => void }>>(new Map());
  const [status, setStatus] = useState<GatewayStatus>("disconnected");

  const connect = useCallback(() => {
    if (!url || !token) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      // Send connect handshake with correct OpenClaw Protocol v3
      const connectMsg: GatewayMessage = {
        type: "req",
        id: `connect-${++reqIdRef.current}`,
        method: "connect",
        params: {
          minProtocol: 3,
          maxProtocol: 3,
          client: {
            id: "gateway-client",
            version: "1.0.0",
            platform: typeof navigator !== "undefined" ? navigator.platform : "web",
            mode: "ui",
          },
          auth: {
            token,
          },
        },
      };
      ws.send(JSON.stringify(connectMsg));
    };

    ws.onmessage = (event) => {
      try {
        const msg: GatewayMessage = JSON.parse(event.data);

        if (msg.type === "res") {
          // Handle response to our requests
          if (msg.id && pendingRef.current.has(msg.id)) {
            const pending = pendingRef.current.get(msg.id)!;
            pendingRef.current.delete(msg.id);
            if (msg.ok) {
              pending.resolve(msg.payload);
            } else {
              pending.reject(msg.error);
            }
          }
          // Check for successful connect
          if (msg.ok && status !== "connected") {
            setStatus("connected");
          }
        }

        if (msg.type === "event") {
          onEvent?.(msg.event!, msg.payload);
        }
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onerror = () => setStatus("error");

    ws.onclose = () => {
      setStatus("disconnected");
      wsRef.current = null;
      // Auto-reconnect after 3 seconds
      setTimeout(() => connect(), 3000);
    };
  }, [url, token, onEvent, status]);

  // Send a request to the Gateway and get a response
  const sendRequest = useCallback(
    (method: string, params: Record<string, unknown> = {}) => {
      return new Promise<unknown>((resolve, reject) => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          reject(new Error("Gateway not connected"));
          return;
        }

        const id = `req-${++reqIdRef.current}`;
        pendingRef.current.set(id, { resolve, reject });

        const msg: GatewayMessage = { type: "req", id, method, params };
        ws.send(JSON.stringify(msg));

        // Timeout after 30 seconds
        setTimeout(() => {
          if (pendingRef.current.has(id)) {
            pendingRef.current.delete(id);
            reject(new Error("Request timed out"));
          }
        }, 30_000);
      });
    },
    []
  );

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setStatus("disconnected");
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { status, sendRequest, disconnect, reconnect: connect };
}
