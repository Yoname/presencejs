declare global {
  interface Window {
    WebTransport: any;
  }
}

export type State = {
  id: string;
  [key: string]: any;
};

/**
 * @param state - the state of the presence instance
 * @param payload - the payload of the event
 * @example { state: { id: 'my-id' }, payload: { foo: 'bar' } }
 */
export type PayloadPacket<T> = {
  state: State;
  payload?: T;
};

export type PresenceOptions = {
  id?: string;
  publicKey?: string;
  reliable?: boolean; // default: false
  debug?: boolean; // default: false
  autoDowngrade?: boolean; // default: false
};

// internal options, create presence instance with this options
export type InternalPresenceOptions = {
  id: string;
  reliable: boolean;
  publicKey?: string;
  debug: boolean;
  autoDowngrade: boolean;
};

enum ConnectionStatus {
  CONNECTING = 'connecting', // Connecting, indicates the initial connection attempt, code 0
  OPEN = 'open', // Connected successfully, code 1
  CLOSED = 'closed', // Disconnected, code 2
}

interface ConnectionStatusObject {
  status: ConnectionStatus;
  code: number;
  details: string;
}

type ConnectionStatusCallback = (status: ConnectionStatusObject) => void;

/**
 * @param onReady - callback function when the presence instance is ready
 * @param onError - callback function when the presence instance is error
 * @param onClosed - callback function when the presence instance is closed
 */
export interface IPresence {
  onReady(callbackFn: (presence: IPresence) => void): void;
  /**
   * join a channel
   * @param channelId a unique channel id
   * @param state join channel initial state
   * @returns {Channel}
   */
  joinChannel: (channelId: string, metadata?: State) => IChannel;
  leaveChannel: (channelId: string) => void;
  on: (status: ConnectionStatus, cb: ConnectionStatusCallback) => void;
}

type Peers = State[];

export type PeersSubscribeCallbackFn = (peers: Peers) => any;
export type PeersUnsubscribe = Function;
export type Unsubscribe = Function;
export type PeersSubscribe = (
  callbackFn: PeersSubscribeCallbackFn
) => PeersUnsubscribe;
export type IPeers = { subscribe: PeersSubscribe };

export type ChannelEventSubscribeCallbackFn<T> = (
  payload: T,
  state: State
) => any;

export interface IChannel {
  id: string;
  broadcast<T>(eventName: string, payload: T): void;
  subscribe<T>(
    eventName: string,
    callbackFn: ChannelEventSubscribeCallbackFn<T>
  ): Unsubscribe;
  subscribePeers: PeersSubscribe;
  leave(): void;
}

export interface Signaling {
  t: 'control' | 'data';
  op?: 'channel_join' | 'peer_online' | 'peer_state' | 'peer_offline';
  p?: string;
  c: string;
  pl?: ArrayBuffer;
}
