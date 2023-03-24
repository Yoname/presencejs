import { create } from 'zustand';
import { keyMapping } from './keyMapping';
import { Frequency, Synth } from 'tone';
import { IChannel, IPresence } from '@yomo/presence';

export interface Log {
  userId: string;
  note: string;
  timestamp: number;
}

export interface KeyMap {
  key: string;
  note: string;
  pressed?: boolean;
  synth?: Synth;
}

export interface User {
  userId: string;
  color: string;
}

export interface Channel {
  broadcast: (eventName: string, data: any) => void;
  subscribe: (eventName: string, callback: (data: any) => void) => void;
}
export interface PianoStore {
  connected: boolean;
  presence: Promise<IPresence> | null;
  channel: Channel | null;

  keyMapping: KeyMap[];

  realKeyVisible: boolean;
  notesVisible: boolean;
  mute: boolean;

  userId: string;
  color: string;

  users: User[];
  logs: Log[];
  otherPressedKeys: {
    [id in string]: string[];
  };

  connect: (presence: Promise<IPresence>, channel: IChannel) => void;

  toggleRealKeyVisible: () => void;
  toggleNotesVisible: () => void;
  toggleMute: () => void;

  keyDown: (key: string) => void;
  keyUp: (key: string) => void;
  otherKeyDown: (key: string, userId: string) => void;
  otherKeyUp: (key: string) => void;
}

const createPianoStore = () => {
  const userId = Math.random()
    .toString()
    .substring(2, 11);
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  return create<PianoStore>((set, get) => ({
    connected: false,
    presence: null,
    channel: null,

    keyMapping,

    realKeyVisible: false,
    notesVisible: false,
    mute: false,

    userId,
    color,

    logs: [],

    users: [
      {
        userId,
        color,
      },
    ],

    otherPressedKeys: {},

    connect: (presence: Promise<IPresence>, channel: IChannel) => {
      channel.subscribe('keyDown', ({ payload, state }: any) => {
        get().otherKeyDown(payload.key, state.id);
      });

      channel.subscribe('keyUp', ({ payload }: any) => {
        get().otherKeyUp(payload.key);
      });

      channel.subscribePeers((peers: any) => {
        // user offline, remove from otherPressedKeys and trigger otherKeyUp
        Object.keys(get().otherPressedKeys).forEach(id => {
          if (!peers[id]) {
            get().otherPressedKeys[id].forEach(key => {
              get().otherKeyUp(key);
            });
            delete get().otherPressedKeys[id];
          }
        });
        set({
          users: [
            {
              userId: get().userId,
              color: get().color,
            },
            ...peers
              .filter((peer: any) => peer.id)
              .map((peer: any) => ({
                userId: peer.id,
                color: peer.color,
              })),
          ],
        });
      });

      set({
        presence,
        channel,
      });
    },

    // realKey and note is mutually exclusive
    toggleRealKeyVisible: () => {
      set(state => ({ realKeyVisible: !state.realKeyVisible }));
      set({ notesVisible: false });
    },
    toggleNotesVisible: () => {
      set(state => ({ notesVisible: !state.notesVisible }));
      set({ realKeyVisible: false });
    },
    toggleMute: () => set(state => ({ mute: !state.mute })),
    keyDown: key => {
      set(state => ({
        keyMapping: state.keyMapping.map(km => {
          if (km.key === key) {
            if (km.pressed) return km;
            const synth = new Synth().toDestination();
            if (state.mute) {
              synth.volume.value = -100;
            }
            synth.triggerAttack(Frequency(km.note));
            return { ...km, pressed: true, synth };
          }
          return km;
        }),
        logs: [
          {
            userId: state.userId,
            note: state.keyMapping.find(km => km.key === key)?.note || '',
            timestamp: Date.now(),
          },
          ...state.logs.slice(0, 20),
        ],
      }));
      get().channel?.broadcast('keyDown', { key });
    },
    keyUp: key => {
      set(state => ({
        keyMapping: state.keyMapping.map(km => {
          if (km.key === key) {
            km.synth?.triggerRelease();
            return { ...km, pressed: false };
          }
          return km;
        }),
      }));
      get().channel?.broadcast('keyUp', { key });
    },
    otherKeyDown: (key, userId) => {
      set(state => ({
        keyMapping: state.keyMapping.map(km => {
          if (km.key === key) {
            if (km.pressed) return km;
            const synth = new Synth().toDestination();
            if (state.mute) {
              synth.volume.value = -100;
            }
            synth.triggerAttack(Frequency(km.note));
            return { ...km, pressed: true, synth };
          }
          return km;
        }),
        logs: [
          {
            userId,
            note: state.keyMapping.find(km => km.key === key)?.note || '',
            timestamp: Date.now(),
          },
          ...state.logs.slice(0, 20),
        ],
      }));
    },
    otherKeyUp: key => {
      set(state => ({
        keyMapping: state.keyMapping.map(km => {
          if (km.key === key) {
            km.synth?.triggerRelease();
            return { ...km, pressed: false };
          }
          return km;
        }),
      }));
    },
  }));
};

export const usePianoStore = createPianoStore();
