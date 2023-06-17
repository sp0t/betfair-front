import { createSlice } from '@reduxjs/toolkit'

export const SocketSlice = createSlice({
    name: 'Socket',
    initialState: {
      connected: false,
      alarmstate: false,
      wmatch: [],
      wodd: [],
      sendtime: '',
      wbetdata:{},
      wstakemode:{},
    },
    reducers: {
        setConnect: (state, action) => {
            state.connected = action.payload;
        },
        setWmatch: (state, action) => {
            state.wmatch = action.payload;
        },
        setWodd: (state, action) => {
            state.wodd = action.payload;
        },
        setSendTime: (state, action) => {
            state.sendtime = action.payload;
        },
        setWbetdata: (state, action) => {
            state.wbetdata = action.payload;
        }
    }
  })

export const { setConnect, setWmatch, setWodd, setSendTime, setWbetdata } = SocketSlice.actions
export const Connected = state => state.Socket.connected
export const Wmatch = state => state.Socket.wmatch
export const Wodd = state => state.Socket.wodd
export const SendTime = state => state.Socket.sendtime
export const Wbetdata = state => state.Socket.wbetdata
export default SocketSlice.reducer
