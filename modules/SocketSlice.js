import { createSlice } from '@reduxjs/toolkit'

export const SocketSlice = createSlice({
    name: 'Socket',
    initialState: {
      wsocket: null
    },
    reducers: {
        setWebSocket: (state, action) => {
        state.wsocket = action.payload
      }
    }
  })

export const { setWebSocket } = SocketSlice.actions
export const webSocket = state => state.Socket.wsocket
export default SocketSlice.reducer
