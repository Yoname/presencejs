'use client';

import { KeyMap, usePianoStore } from '@/app/store';
import { Divider } from './Divider';
import { Panel } from './Panel';

export function KeyMapping() {
  const [keyMapping] = usePianoStore(state => [state.keyMapping]);

  // key mapping split six groups
  const keyMappingGroups = keyMapping.reduce((acc, key, index) => {
    const groupIndex = Math.floor(index / 6);
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(key);
    return acc;
  }, [] as KeyMap[][]);

  return (
    <Panel
      header={
        <div className="flex justify-between gap-[86px]">
          <div className="flex justify-between flex-1">
            <div>Key</div>
            <div>Note</div>
          </div>
          <div className="flex justify-between flex-1">
            <div>Key</div>
            <div>Note</div>
          </div>
        </div>
      }
      body={
        <div className="">
          <div className="pt-3 pb-2 flex justify-between gap-[86px]">
            <div className="flex flex-col flex-1">
              {keyMappingGroups[0].map(keyMap => (
                <div key={keyMap.key} className="inline-flex justify-between">
                  <div>{keyMap.key}</div>
                  <div>{keyMap.note}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col flex-1">
              {keyMappingGroups[3].map(keyMap => (
                <div key={keyMap.key} className="inline-flex justify-between">
                  <div>{keyMap.key}</div>
                  <div>{keyMap.note}</div>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <div className="pt-3 pb-2 flex justify-between gap-[86px]">
            <div className="flex flex-col flex-1">
              {keyMappingGroups[1].map(keyMap => (
                <div key={keyMap.key} className="inline-flex justify-between">
                  <div>{keyMap.key}</div>
                  <div>{keyMap.note}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col flex-1">
              {keyMappingGroups[4].map(keyMap => (
                <div key={keyMap.key} className="inline-flex justify-between">
                  <div>{keyMap.key}</div>
                  <div>{keyMap.note}</div>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <div className="pt-3 pb-2 flex justify-between gap-[86px]">
            <div className="flex flex-col flex-1">
              {keyMappingGroups[2].map(keyMap => (
                <div key={keyMap.key} className="inline-flex justify-between">
                  <div>{keyMap.key}</div>
                  <div>{keyMap.note}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col flex-1">
              {keyMappingGroups[5].map(keyMap => (
                <div key={keyMap.key} className="inline-flex justify-between">
                  <div>{keyMap.key}</div>
                  <div>{keyMap.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    ></Panel>
  );
}
