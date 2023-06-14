import { createSlice } from '@reduxjs/toolkit'

export const SocketSlice = createSlice({
    name: 'Socket',
    initialState: {
      connected: false,
      alarmstate: false,
      wmatch: [],
      wodd:[],
      wbet:[],
      message:'', 
    },
    reducers: {
        setConnect: (state, action) => {
            state.connected = action.payload;
        },
        setAlarmstate: (state, action) => {
            state.alarmstate = action.payload;
        },
        setWmatch: (state, action) => {
            state.wmatch = action.payload;
        },
        setWodd: (state, action) => {
            state.wodd = action.payload;
        },
        setWbet: (state, action) => {
            state.wbet = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        }
    }
  })

export const { setConnect, setAlarmstate, setWmatch,  setWodd, setWbet, setMessage } = SocketSlice.actions
export const Connected = state => state.Socket.connected
export const Alarmstate = state => state.Socket.alarmstate
export const Wmatch = state => state.Socket.wmatch
export const Wodd = state => state.Socket.wodd
export const Wbet = state => state.Socket.wbet
export const Message = state => state.Socket.message
export default SocketSlice.reducer
