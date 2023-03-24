'use client';

import { Key } from './Icons/Key';
import { Note } from './Icons/Note';
import { Mute } from './Icons/Mute';
import { Unmute } from './Icons/Unmute';
import { usePianoStore } from '@/app/store';
import { Hole } from './Icons/Hole';
import GroupHug from '@yomo/group-hug-react';
import '@yomo/group-hug-react/style.css';

export function ControlPanel() {
  const [
    userId,
    color,
    realKeyVisible,
    notesVisible,
    mute,
    toggleRealKeyVisible,
    toggleNotesVisible,
    toggleMute,
    channel,
    presence,
  ] = usePianoStore(state => [
    state.userId,
    state.color,
    state.realKeyVisible,
    state.notesVisible,
    state.mute,
    state.toggleRealKeyVisible,
    state.toggleNotesVisible,
    state.toggleMute,
    state.channel,
    state.presence,
  ]);

  return (
    <div
      className="flex justify-between items-center border-[#393742]  border rounded-t-md border-b-0
      px-6 pt-4 pb-8 text-[#949398] w-full"
      style={{
        background: 'linear-gradient(182.68deg, #242329 2.6%, #15131C 111.16%)',
      }}
    >
      <div className="flex gap-4">
        <ControlButton onClick={toggleRealKeyVisible} active={realKeyVisible}>
          <Key />
          Real Keys
        </ControlButton>
        <ControlButton onClick={toggleNotesVisible} active={notesVisible}>
          <Note />
          Notes
        </ControlButton>
        <ControlButton onClick={toggleMute} active={mute}>
          {mute ? <Unmute /> : <Mute />}
          {mute ? 'Tap to Unmute' : 'Tap to mute'}
        </ControlButton>
      </div>

      <Hole />

      <div className="z-10">
        {presence && (
          <GroupHug
            presence={presence}
            id={userId}
            name={userId}
            avatarBorderColor={color}
            darkMode
          />
        )}
      </div>
    </div>
  );
}

function ControlButton({
  children,
  active = false,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-[14px] py-[10px] bg-[#14121A] border rounded-[6px] flex items-center gap-2 focus:outline-none
      ${active ? 'border-[#3C499C]' : 'border-[#393742]'}
      ${active ? 'text-[#8C92FF]' : 'text-[#949398]'}
      ${className}
    `}
    >
      {children}
    </button>
  );
}
