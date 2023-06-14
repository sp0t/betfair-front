import '@/styles/globals.css'
import { Provider } from 'react-redux'
import store from '../modules/store'
import { initSocket } from '@/modules/websocketManager';

export default function App({ Component, pageProps }) {
  initSocket(store);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  ); 
}
