// websocketManager.js

import { setConnect, setAlarmstate, setWmatch,  setWodd, setWbet, setWstakemode, setMessage } from './SocketSlice';

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

      if (parseMsg.type == 'betalarm') {
        store.dispatch(setMessage(parseMsg.data));
        store.dispatch(setAlarmstate(true));
      }

      if (parseMsg.type == 'BetInformation') {
        console.log('=============================================> receive BetInformation!!!');
        var ret = parseMsg.data;
        var tmpbtdata = [];
        var tmppsdata = [];
        if (ret.betfair != undefined)
        {
          tmpbtdata = ret.betfair.market;
        }
        if (ret.ps3838 != undefined) {
          tmppsdata = ret.ps3838.market;
        }
        if (ret.data)
            store.dispatch(setWbet(ret.betdata));
        var oddtemp = [];
        var x = 0;
        var y = 0;
    
        
    
        while (x < tmpbtdata.length || y < tmppsdata.length) {
          var data = {};
          const date1 = new Date(tmpbtdata[x]).update;
          const date2 = new Date(tmppsdata[y]).update;
    
          data.ps3838 = {};
          data.betfair = {};
    
          if (date1 > date2) {
            data.gamedate = tmppsdata[y].update;
            data.ps3838 = tmppsdata[y].moneyline;
    
            if (x == 0) {
              if (tmpbtdata[0] == undefined) {
                data.betfair.away = '-';
                data.betfair.home = '-';
              } else {
                data.betfair.away = tmpbtdata[0].moneyline.away.availableToBack[0].price;
                data.betfair.home = tmpbtdata[0].moneyline.home.availableToBack[0].price;
              }
            } else {
              if (tmpbtdata[x-1] == undefined) {
                data.betfair.away = '-';
                data.betfair.home = '-';
              } else {
                data.betfair.away = tmpbtdata[x-1].moneyline.away.availableToBack[0].price;
                data.betfair.home = tmpbtdata[x-1].moneyline.home.availableToBack[0].price;
              }
            }
    
            y++;
            
          }else if (date1 < date2) {
            data.gamedate = tmpbtdata[x].update;

            if (tmpbtdata[x] == undefined) {
              data.betfair.away = '-';
              data.betfair.home = '-';
            } else {
              data.betfair.away = tmpbtdata[x].moneyline.away.availableToBack[0].price;
              data.betfair.home = tmpbtdata[x].moneyline.home.availableToBack[0].price;
            }
    
            if (y == 0) {
              if (tmppsdata[0] == undefined) {
                data.ps3838.away = '-';
                data.ps3838.home = '-';
              } else data.ps3838 = tmppsdata[0].moneyline;
            } else {
              if (tmppsdata[y-1] == undefined) {
                data.ps3838.away = '-';
                data.ps3838.home = '-';
              } else data.ps3838 = tmppsdata[y-1].moneyline;
            }
  
            x++;
          } else {
    
            if (tmpbtdata[x] == undefined) {
              data.gamedate = tmppsdata[y].update;
              if (tmpbtdata[x-1] == undefined) {
                data.betfair.away = '-';
                data.betfair.home = '-';
              } else {
                data.betfair.away = tmpbtdata[x-1].moneyline.away.availableToBack[0].price;
                data.betfair.home = tmpbtdata[x-1].moneyline.home.availableToBack[0].price;
              }

              if (tmppsdata[y] == undefined) {
                data.ps3838.away = '-';
                data.ps3838.home = '-';
              } else data.ps3838 = tmppsdata[y].moneyline;

              y++;
            } else if (tmppsdata[y] == undefined) {
              data.gamedate = tmpbtdata[x].update;

              if (tmpbtdata[x] == undefined) {
                data.betfair.away = '-';
                data.betfair.home = '-';
              } else {
                data.betfair.away = tmpbtdata[x].moneyline.away.availableToBack[0].price;
                data.betfair.home = tmpbtdata[x].moneyline.home.availableToBack[0].price;
              }

              if (tmppsdata[y-1] == undefined) {
                data.ps3838.away = '-';
                data.ps3838.home = '-';
              } else data.ps3838 = tmppsdata[y-1].moneyline;
              x++;
            } else {
              data.gamedate = tmpbtdata[x].update;

              if (tmpbtdata[x] == undefined) {
                data.betfair.away = '-';
                data.betfair.home = '-';
              } else {
                data.betfair.away = tmpbtdata[x].moneyline.away.availableToBack[0].price;
                data.betfair.home = tmpbtdata[x].moneyline.home.availableToBack[0].price;
              }

              if (tmppsdata[y] == undefined) {
                data.ps3838.away = '-';
                data.ps3838.home = '-';
              } else data.ps3838 = tmppsdata[y].moneyline;
              x++;
              y++;
            }
          }
    
          oddtemp.push(data);
        }
    
        store.dispatch(setWodd(oddtemp));
      }
  };

  socket.onclose = () => {
    store.dispatch(setConnect(false));
  };

  return socket;
};

export const getSocket = () => socket;
