let wssocket;

export const initSocket = () => {
  if (wssocket == null) {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKETURL);
    return new Promise((resolve, reject) => {
      socket.onopen = () => {
        wssocket = socket;
        resolve(wssocket);
      };
      socket.onerror = (error) => {
        reject(error);
      };
    });
  }

  return Promise.resolve(wssocket);
};

export const getSocket = () => {
  return wssocket;
};
