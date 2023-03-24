import { KeyMap, usePianoStore } from '@/app/store';
import { Status } from './Status';

export function BlackButton({ keyMap }: { keyMap: KeyMap }) {
  const [realKeyVisible, keyDown, keyUp, logs, users] = usePianoStore(state => [
    state.realKeyVisible,
    state.keyDown,
    state.keyUp,
    state.logs,
    state.users,
  ]);

  const userId = logs.find(log => log.note === keyMap.note)?.userId;
  const user = users.find(user => user.userId === userId);

  return (
    <span
      className="relative"
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
        width="49"
        height="167"
        viewBox="0 0 49 167"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_33_759)">
          <path
            d="M4 0H45V152C45 155.314 42.3137 158 39 158H10C6.68629 158 4 155.314 4 152V0Z"
            fill="url(#paint0_linear_33_759)"
          />
        </g>
        <mask
          id="mask0_33_759"
          maskUnits="userSpaceOnUse"
          x="4"
          y="0"
          width="41"
          height="158"
        >
          <path
            d="M5 1H44V152C44 154.761 41.7614 157 39 157H10C7.23858 157 5 154.761 5 152V1Z"
            fill="url(#paint1_linear_33_759)"
            stroke="black"
            strokeWidth="2"
          />
        </mask>
        <g mask="url(#mask0_33_759)">
          <g opacity="0.7" filter="url(#filter1_f_33_759)">
            <path
              d="M5.5 2C5.5 -1.03756 7.96243 -3.5 11 -3.5H38C41.0376 -3.5 43.5 -1.03757 43.5 2V150C43.5 153.038 41.0376 155.5 38 155.5H11C7.96243 155.5 5.5 153.038 5.5 150V2Z"
              stroke="white"
            />
          </g>
          <path
            d="M5 4.29153e-06C5 -2.76142 7.23858 -5 10 -5H39C41.7614 -5 44 -2.76142 44 0V152C44 154.761 41.7614 157 39 157H10C7.23857 157 5 154.761 5 152V4.29153e-06Z"
            stroke="black"
            strokeWidth="2"
          />
          <g filter="url(#filter2_f_33_759)">
            <path
              d="M10 -5H39V142C39 145.314 36.3137 148 33 148H16C12.6863 148 10 145.314 10 142V-5Z"
              fill="url(#paint2_linear_33_759)"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_33_759"
            x="0"
            y="0"
            width="49"
            height="167"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0117647 0 0 0 0 0.0156863 0 0 0 0 0.0196078 0 0 0 0.33 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_33_759"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_33_759"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_f_33_759"
            x="3"
            y="-6"
            width="43"
            height="164"
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
              stdDeviation="1"
              result="effect1_foregroundBlur_33_759"
            />
          </filter>
          <filter
            id="filter2_f_33_759"
            x="8"
            y="-7"
            width="33"
            height="157"
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
              stdDeviation="1"
              result="effect1_foregroundBlur_33_759"
            />
          </filter>
          <linearGradient
            id="paint0_linear_33_759"
            x1="24.5"
            y1="0"
            x2="24.5"
            y2="158"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1E1E1E" />
            <stop offset="1" stopColor="#212022" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_33_759"
            x1="24.5"
            y1="0"
            x2="24.5"
            y2="158"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#333333" />
            <stop offset="0.614583" stopColor="#212121" />
            <stop offset="1" stopColor="#121212" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_33_759"
            x1="24.5"
            y1="-5"
            x2="24.5"
            y2="148"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1C1921" />
            <stop offset="1" stopColor="#424242" />
          </linearGradient>
        </defs>
      </svg>
      {realKeyVisible && (
        <span className="absolute bottom-4 text-[#B9B7BD] left-0 right-0 text-center">
          {keyMap.key}
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
