import { Inter } from 'next/font/google';
import { Logo } from './components/Logo';
import { Piano } from './components/Piano';
import { KeyMapping } from './components/Info/KeyMapping';
import { AttackLog } from './components/Info/AttackLog';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div
      className={`${inter.className} bg-[#030405]
      w-screen h-screen
      py-5 px-10
      flex justify-between gap-[130px] min-w-[1920px]
    `}
    >
      <div className="flex flex-col flex-1">
        <Logo />

        <Piano className="flex-1 flex justify-center items-center min-w-[1364px]" />
      </div>

      <div className="flex flex-col gap-6 max-h-[calc(100vh-40px)]">
        <KeyMapping />
        <div className="flex-1 overflow-hidden">
          <AttackLog />
        </div>
      </div>
    </div>
  );
}
 