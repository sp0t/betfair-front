import { createSlice } from '@reduxjs/toolkit'

export const SocketSlice = createSlice({
    name: 'Socket',
    initialState: {
      connected: false,
      alarmstate: false,
      wmatch: [],
      wstakemode:{},
    },
    reducers: {
        setConnect: (state, action) => {
            state.connected = action.payload;
        },
        setWmatch: (state, action) => {
            state.wmatch = action.payload;
        },
        setWstakemode: (state, action) => {
            state.wstakemode = action.payload;
        }
    }
  })

export const { setConnect, setWmatch, setWstakemode } = SocketSlice.actions
export const Connected = state => state.Socket.connected
export const Wmatch = state => state.Socket.wmatch
export const Wstakemode = state => state.Socket.wstakemode
export default SocketSlice.reducer
