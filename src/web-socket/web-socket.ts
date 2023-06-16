let webSocket: WebSocket | null = null;

export const getWebSocket = () => webSocket;

export const connectWebSocket = () => {
  if (!webSocket) {
    console.log('[Connecting to WebSocket...]');
    webSocket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
  } else {
    console.log('[WebSocket already connected]');
  }
};

export const disconnectWebSocket = () => {
  if (webSocket) {
    console.log('[Disconnecting WebSocket...]');
    webSocket.close();
    webSocket = null;
  } else {
    console.log('[WebSocket already disconnected]');
  }
};
