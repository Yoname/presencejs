import { Channel } from './channel';
import {
  IChannel,
  InternalPresenceOptions,
  IPresence,
  State,
  PresenceOptions,
} from './types';
import { randomId } from './utils';
import WebTransport from '@yomo/webtransport-polyfill';
import { Logger } from './logger';

export class Presence implements IPresence {
  #url: string = '';
  #state: State;
  #channels: Map<string, IChannel> = new Map();
  #transport: any;
  #options: InternalPresenceOptions;
  #logger: Logger;
  #onReadyCallbackFn: Function = () => { };
  #onErrorCallbackFn: Function = () => { };
  #onClosedCallbackFn: Function = () => { };

  constructor(url: string, options: InternalPresenceOptions) {
    this.#state = {
      id: options.id,
    };
    this.#options = options;
    this.#logger = new Logger({
      enabled: options.debug,
      module: 'presence',
    });
    (async () => {
      this.#url = await this.#formatUrl(url);
      this.#connect();
    })();
  }

  async #formatUrl(url: string) {
    if (typeof url !== 'string' || !url.startsWith('https://')) {
      throw new Error('Invalid url');
    }
    if ('id' in this.#options && 'publicKey' in this.#options) {
      return this.#formatUrlWithPublicKey(url);
    }
    throw new Error('Invalid options');
  }

  #formatUrlWithPublicKey(url: string) {
    return `${url}?publickey=${this.#options.publicKey}&id=${this.#state.id}`;
  }

  onReady(callbackFn: Function) {
    this.#onReadyCallbackFn = callbackFn;
  }
  onError(callbackFn: Function) {
    this.#onErrorCallbackFn = callbackFn;
  }
  onClosed(callbackFn: Function) {
    this.#onClosedCallbackFn = callbackFn;
  }
  joinChannel(channelId: string, state?: State) {
    this.#state = {
      ...this.#state,
      ...(state || {}),
    };
    const channel = new Channel(channelId, this.#state, this.#transport, {
      reliable: this.#options.reliable,
      debug: this.#options.debug || false,
    });
    this.#channels.set(channelId, channel);
    return channel;
  }

  leaveChannel(channelId: string) {
    const channel = this.#channels.get(channelId);
    if (channel) {
      channel.leave();
    }
  }

  #connect() {
    this.#transport = new window.WebTransport(this.#url);

    this.#transport.ready
      .then(() => {
        this.#onReadyCallbackFn();
      })
      .catch((e: Error) => {
        this.#onErrorCallbackFn(e);
      });

    this.#transport.closed
      .then(() => {
        this.#onClosedCallbackFn();
        this.#channels.forEach((channel) => {
          channel.leave();
        });
      })
      .catch((e: Error) => {
        this.#logger.log('error: ', e);
        if (!this.#options.autoDowngrade) {
          return;
        }
        setTimeout(() => {
          // force to use the polyfill
          window.WebTransport = WebTransport;
          this.#connect();
        }, 2_000);
      });
  }
}

const defaultOptions: InternalPresenceOptions = {
  id: randomId(),
  reliable: false,
  debug: false,
  autoDowngrade: false,
};

/**
 * create a presence instance
 * @param url backend url
 * @param {string} options.id - the id of the presence instance
 * @param {string} options.publicKey - the public key of the presence instance
 * @param {boolean} options.reliable - whether to use reliable transport
 * @param {boolean} options.debug - whether to enable debug mode
 * @param {boolean} options.autoDowngrade - whether to auto downgrade to unreliable transport, when the reliable transport is not available
 * @returns {Promise<IPresence>}
 */
export function createPresence(
  url: string,
  options: PresenceOptions
): Promise<IPresence>;
export function createPresence(url: string, options: PresenceOptions) {
  return new Promise((resolve) => {
    const internalOptions: InternalPresenceOptions = {
      ...defaultOptions,
      ...options,
    };
    const presence = new Presence(url, internalOptions);
    presence.onReady(() => {
      resolve(presence);
    });
    // presence.onClosed(() => {
    //   reject('closed');
    // });
    // presence.onError((e: any) => {
    //   reject(e);
    // });
  });
}
