// websocketManager.js

import { setConnect, setWmatch, setWodd, setWbetdata, setSendTime } from './SocketSlice';
import { ToastContainer, toast } from 'react-toastify';

let store = null;
let socket = null;

export const initSocket = (reduxStore) => {
  store = reduxStore;

  if (!socket)
    socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKETURL);

  socket.onopen = () => {
    store.dispatch(setConnect(true));
  };

  socket.onmessage = (event) => {
    var parseMsg = JSON.parse(event.data);
      if (parseMsg.type == 'betalarm') {
        toast.success(parseMsg.data)
      }
      if (parseMsg.type == 'SportLeagueName') {
        console.log('betdata===========>', parseMsg)
        store.dispatch(setWmatch(parseMsg.data));
        store.dispatch(setSendTime(parseMsg.time));
      }
      if (parseMsg.type == 'BetInformation') {
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
        if (ret.betdata != undefined) {
          store.dispatch(setWbetdata(ret.betdata));
        }
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
                data.betfair.away = tmpbtdata[0].moneyline.away;
                data.betfair.home = tmpbtdata[0].moneyline.home;
              }
            } else {
              if (tmpbtdata[x-1] == undefined) {
                data.betfair.away = '-';
                data.betfair.home = '-';
              } else {
                data.betfair.away = tmpbtdata[x-1].moneyline.away;
                data.betfair.home = tmpbtdata[x-1].moneyline.home;
              }
            }
    
            y++;
            
          }else if (date1 < date2) {
            data.gamedate = tmpbtdata[x].update;

            if (tmpbtdata[x] == undefined) {
              data.betfair.away = '-';
              data.betfair.home = '-';
            } else {
              data.betfair.away = tmpbtdata[x].moneyline.away;
              data.betfair.home = tmpbtdata[x].moneyline.home;
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
                data.betfair.away = tmpbtdata[x-1].moneyline.away;
                data.betfair.home = tmpbtdata[x-1].moneyline.home;
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
                data.betfair.away = tmpbtdata[x].moneyline.away;
                data.betfair.home = tmpbtdata[x].moneyline.home;
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
                data.betfair.away = tmpbtdata[x].moneyline.away;
                data.betfair.home = tmpbtdata[x].moneyline.home;
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

export const sendSportLeagueName = (sport, leauge) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    var ret = {
      type: 'SportLeagueName',
      sportname: sport,
      competitionname: leauge
    };
    socket.send(JSON.stringify(ret));
  }
}

export const sendBetInfor = (monitid, betid, away, home) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    var ret = {
      type: 'BetInformation',
      monitid: monitid,
      betid: betid,
      away: away, 
      home: home
    };
    socket.send(JSON.stringify(ret));
  }
}


export const getSocket = () => socket;
