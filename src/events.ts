import { Message } from "./entity/Message";

interface ServerToClientEvents {
    noArg: () => void;
    msgRecive: (msg: Message) => void
  }
  
  interface ClientToServerEvents {
    hello: () => void;
  }
  
  interface InterServerEvents {
    ping: () => void;
  }
  
  interface SocketData {
    name: string;
  }
  
  export { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData }