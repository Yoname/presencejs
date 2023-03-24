'use client';

import { Log, usePianoStore } from '@/app/store';
import dayjs from 'dayjs';
import { Panel } from './Panel';

export function AttackLog() {
  const [logs] = usePianoStore(state => [state.logs]);

  return (
    <Panel
      header={<div>Live Piano</div>}
      body={
        <>
          <div className="pt-1 pb-6 relative flex flex-col max-h-full">
            {logs.map(log => (
              <Log key={log.userId + log.note + log.timestamp} log={log} />
            ))}
          </div>

          <div
            className="absolute h-[82px] bottom-0 left-0 right-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(20, 18, 26, 0) 0%, #14121A 76.47%)',
            }}
          ></div>
        </>
      }
      className="h-full"
    ></Panel>
  );
}

function Log({ log }: { log: Log }) {
  const users = usePianoStore(state => state.users);
  const user = users.find(user => user.userId === log.userId);
  return (
    <div className="flex justify-between py-2">
      <div className="inline-flex gap-2 items-center">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: user?.color }}
        ></span>
        {log.userId}
      </div>
      <div>attack {log.note}</div>
      <div>{dayjs(log.timestamp).format('mm:ss')}</div>
    </div>
  );
}
