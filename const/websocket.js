require("dotenv").config();
let wssocket;

const initSocket = () => {
    if (wssocket == null) {
        const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKETURL);
        if (socket != null) {
            wssocket = socket;
            return true;
        }
        else
            return false;
    }

    return true;
}

const getScoket = () => {
    return wssocket;
}

module.exports.initSocket = initSocket;
module.exports.getScoket = getScoket;
