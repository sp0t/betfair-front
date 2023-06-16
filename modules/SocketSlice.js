import { createSlice } from '@reduxjs/toolkit'

export const SocketSlice = createSlice({
    name: 'Socket',
    initialState: {
      connected: false,
      alarmstate: false,
      wmatch: [],
      wodd: [],
      wbetdata:[],
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
        setWbetdata: (state, action) => {
            state.wbetdata = action.payload;
        },
        setWstakemode: (state, action) => {
            state.wstakemode = action.payload;
        }
    }
  })

export const { setConnect, setWmatch, setWodd, setWbetdata, setWstakemode } = SocketSlice.actions
export const Connected = state => state.Socket.connected
export const Wmatch = state => state.Socket.wmatch
export const Wodd = state => state.Socket.wodd
export const Wbetdata = state => state.Socket.wbetdata
export const Wstakemode = state => state.Socket.wstakemode
export default SocketSlice.reducer
