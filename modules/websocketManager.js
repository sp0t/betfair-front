// websocketManager.js

import { setConnect, setWmatch, setWstakemode } from './SocketSlice';

let store = null;
let socket = null;

export const initSocket = (reduxStore) => {
  store = reduxStore;
  socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKETURL);

  socket.onopen = () => {
    store.dispatch(setConnect(true));
  };

  socket.onmessage = (event) => {
    var parseMsg = JSON.parse(event.data);
      if (parseMsg.type == 'SportLeagueName') {
        console.log('=============================================> receive SportLeagueName!!!', parseMsg.stakemode);
        store.dispatch(setWmatch(parseMsg.data));
        store.dispatch(setWstakemode(parseMsg.stakemode));
      }
  };

  socket.onclose = () => {
    store.dispatch(setConnect(false));
  };

  return socket;
};

export const getSocket = () => socket;
