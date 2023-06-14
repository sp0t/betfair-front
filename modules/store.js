import { configureStore } from '@reduxjs/toolkit'

import SocketSlice from './SocketSlice'

export default configureStore({
    reducer: {
        Socket: SocketSlice
    }
  })