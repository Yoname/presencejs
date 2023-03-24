'use client';

import { usePianoStore } from '@/app/store';
import { BlackButton } from './BlackButton';
import { ControlPanel } from './ControlPanel';
import { WhiteButton } from './WhiteButton';
import { useEffect, useState } from 'react';
import { createPresence } from '@yomo/presence';

export function Piano({ className }: { className?: string }) {
  const [
    userId,
    color,
    keyMapping,
    keyDown,
    keyUp,
    connect,
  ] = usePianoStore(state => [
    state.userId,
    state.color,
    state.keyMapping,
    state.keyDown,
    state.keyUp,
    state.connect,
  ]);

  // generate buttons
  const blockButtons = [];
  const whiteButtons = [];

  // black buttons indexes
  const blackButtonIndexes = [
    1,
    3,
    6,
    8,
    10,
    13,
    15,
    18,
    20,
    22,
    25,
    27,
    30,
    32,
    34,
  ];
  for (let i = 0; i < keyMapping.length; i++) {
    const keyMap = keyMapping[i];
    // w b w b w, w b w b w b w, w b w b w, w b w b w b w, w b w b w, w b w b w b w
    if (blackButtonIndexes.includes(i)) {
      blockButtons.push(
        <div
          key={keyMap.key}
          className="absolute"
          // left: before white button count * 64 - self width / 2
          // note: white button need filter use black button indexes
          style={{
            left: `${(i -
              blackButtonIndexes.filter(index => index < i).length) *
              (64 + 1) -
              49 / 2}px`,
          }}
        >
          <BlackButton keyMap={keyMap} />
        </div>
      );
    } else {
      whiteButtons.push(
        <WhiteButton keyMap={keyMap} key={keyMap.key} index={i} />
      );
    }
  }

  // listen keydown event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const keyMap = keyMapping.find(
        keyMap => keyMap.key.toUpperCase() === key
      );
      if (keyMap) {
        keyDown(keyMap.key);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const keyMap = keyMapping.find(
        keyMap => keyMap.key.toUpperCase() === key
      );
      if (keyMap) {
        keyUp(keyMap.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const p = createPresence({
        url: process.env.NEXT_PUBLIC_PRESENCE_URL!,
        publicKey: process.env.NEXT_PUBLIC_PRESENCE_PUBLIC_KEY!,
        appId: process.env.NEXT_PUBLIC_PRESENCE_APP_ID!,
      });
      const channel = (await p).joinChannel('piano', {
        id: userId,
        color,
      });
      connect(p, channel);
    })();
  }, []);

  return (
    <div className={`flex flex-col ${className}`}>
      <ControlPanel />
      <div className="flex relative w-full gap-[1px]">
        {whiteButtons}
        {blockButtons}
      </div>
    </div>
  );
}
