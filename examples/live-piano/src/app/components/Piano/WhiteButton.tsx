import { KeyMap, usePianoStore } from '@/app/store';
import { Status } from './Status';

export function WhiteButton({
  keyMap,
  index,
}: {
  keyMap: KeyMap;
  index: number;
}) {
  const [realKeyVisible, notesVisible, logs, users] = usePianoStore(state => [
    state.realKeyVisible,
    state.notesVisible,
    state.logs,
    state.users,
  ]);

  const userId = logs.find(log => log.note === keyMap.note)?.userId;
  const user = users.find(user => user.userId === userId);

  const key = keyMap[realKeyVisible ? 'key' : 'note'];

  return (
    <span className="relative">
      {keyMap.pressed ? (
        <PressedWhiteButton keyMap={keyMap} />
      ) : (
        <UnpressedWhiteButton keyMap={keyMap} />
      )}

      {(realKeyVisible || notesVisible) && (
        <span
          className={`absolute bottom-4 text-[#949398] left-0 right-0 text-center
            ${notesVisible &&
              `rounded-[6px] w-8 h-8 flex justify-center items-center mx-auto ${
                index < 12 ? 'bg-[#F6F2FC]' : 'bg-[#F2F7FC]'
              }`}
          `}
        >
          {key === 'shift' ? '⇧' : key}
        </span>
      )}

      {keyMap.pressed && (
        <div className="absolute left-0 right-0 flex items-center justify-center -translate-y-full -top-1">
          <Status color={user?.color || 'rgba(255, 255, 255, 0.5)'} />
        </div>
      )}
    </span>
  );
}

function UnpressedWhiteButton({ keyMap }: { keyMap: KeyMap }) {
  const [keyDown, keyUp] = usePianoStore(state => [state.keyDown, state.keyUp]);
  return (
    <div
      className="pb-1"
      onMouseDown={() => {
        keyDown(keyMap.key);

        const mouseUp = () => {
          keyUp(keyMap.key);
          document.removeEventListener('mouseup', mouseUp);
        };

        document.addEventListener('mouseup', mouseUp);
      }}
    >
      <svg
        width="64"
        height="269"
        viewBox="0 0 64 269"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 258H64V263C64 266.314 61.3137 269 58 269H6C2.68629 269 0 266.314 0 263V258Z"
          fill="url(#paint0_linear_33_339)"
        />
        <path
          d="M0 0H64V258C64 261.314 61.3137 264 58 264H6C2.68629 264 0 261.314 0 258V0Z"
          fill="url(#paint1_linear_33_339)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_33_339"
            x1="3.28661e-07"
            y1="262.18"
            x2="65.4365"
            y2="264.451"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A3A2AB" />
            <stop offset="0.53125" stopColor="#BCBBC4" />
            <stop offset="1" stopColor="#A3A2AB" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_33_339"
            x1="32"
            y1="0"
            x2="32"
            y2="264"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F5F5F7" />
            <stop offset="0.723958" stopColor="white" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function PressedWhiteButton({ keyMap }: { keyMap: KeyMap }) {
  return (
    <svg
      width="64"
      height="273"
      viewBox="0 0 64 273"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 262H64V267C64 270.314 61.3137 273 58 273H6C2.68629 273 0 270.314 0 267V262Z"
        fill="url(#paint0_linear_33_739)"
      />
      <path
        d="M0 0H64V264C64 267.314 61.3137 270 58 270H6C2.68629 270 0 267.314 0 264V0Z"
        fill="#B2B2B9"
      />
      <mask
        id="mask0_33_739"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="64"
        height="270"
      >
        <path
          d="M0 0H64V264C64 267.314 61.3137 270 58 270H6C2.68629 270 0 267.314 0 264V0Z"
          fill="#B2B2B9"
        />
      </mask>
      <g mask="url(#mask0_33_739)">
        <g filter="url(#filter0_f_33_739)">
          <path d="M7 0H57V273H7V0Z" fill="#E9E8EE" />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_33_739"
          x="-1"
          y="-8"
          width="66"
          height="289"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="4"
            result="effect1_foregroundBlur_33_739"
          />
        </filter>
        <linearGradient
          id="paint0_linear_33_739"
          x1="3.28661e-07"
          y1="266.18"
          x2="65.4365"
          y2="268.451"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84838A" />
          <stop offset="0.53125" stopColor="#9D9CA3" />
          <stop offset="1" stopColor="#84838A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
