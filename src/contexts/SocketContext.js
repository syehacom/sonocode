import React, { useContext, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://opencode.syeha.com/";

const SocketContext = React.createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(socketIOClient(ENDPOINT));

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
