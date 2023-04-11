import { createPresence } from '@yomo/presence';

export function connect() {
  const id = Math.random()
    .toString()
    .substring(2, 10);
  const avatar = Math.random() > 0.5 ? `https://robohash.org/${id}` : void 0;
  const presencePromise = createPresence(
    process.env.NEXT_PUBLIC_PRESENCE_URL!,
    {
      publicKey: process.env.NEXT_PUBLIC_PRESENCE_PUBLIC_KEY,
      id,
    }
  );
  return { id, avatar, presencePromise };
}
