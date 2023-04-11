import React, {
  createContext,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BlendFunction, KernelSize } from 'postprocessing';
import { useImmer } from 'use-immer';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Center, Text } from '@react-three/drei';
import { DoubleSide, Mesh, Vector3 } from 'three';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion-3d';
import XBlock from '../../components/TicTacToe/XBlock';
import OBlock from '../../components/TicTacToe/OBlock';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import createGrid from '../../components/TicTacToe/utils/createGrid';
import checkWin from '../../components/TicTacToe/utils/checkWin';
import getGridItemKey from '../../components/TicTacToe/utils/getGridItemKey';
import { BLOCK_DISTANCE } from '../../components/TicTacToe/utils/constants';
import Grid from '../../components/TicTacToe/Grid';
import BoardItem from '../../components/TicTacToe/BoardItem';
import BurgerMenu from '../../components/TicTacToe/svgs/burger-menu.svg';
import CloseMenu from '../../components/TicTacToe/svgs/close.svg';
import { Loading } from '@/components/Loading';
import { useRouter } from 'next/router';
import { connect } from '@/utils/presence';
import { IChannel } from '@yomo/presence';
import dynamic from 'next/dynamic';

const CustomOrbitControls: React.FC<{
  winner: string | null;
  turn: string;
  isStart: boolean;
  onReset: () => void;
}> = ({ winner, turn, isStart, onReset }) => {
  const { camera } = useThree();
  const textRef = useRef<Mesh>(null);
  const buttonRef = useRef<Mesh>(null);
  const buttonTextRef = useRef<Mesh>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const style = document.createElement('link');
    style.href = '/tic-tac-toe.css';
    style.rel = 'stylesheet';
    document.body.appendChild(style);

    return () => {
      document.body.removeChild(style);
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'default';
  }, [hover]);

  useFrame(() => {
    // Make it so that these objects always face the camera
    [textRef, buttonRef, buttonTextRef].forEach(ref => {
      ref.current?.quaternion.copy(camera.quaternion);
    });
  });

  return (
    <>
      <Text
        ref={textRef}
        color={'#bdfff0'}
        scale={[3, 3, 3]}
        position={[9, 28, 9]}
        anchorX="center"
      >
        {!isStart
          ? 'Waiting for another player to join...'
          : winner
          ? 'Winner: ' + winner
          : 'Turn: ' + turn}
      </Text>
      {winner && (
        <motion.group
          position={[9, 24, 9]}
          onClick={onReset}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
        >
          <mesh ref={buttonRef}>
            <planeGeometry args={[10, 3]} />
            <meshBasicMaterial color="white" side={DoubleSide} />
          </mesh>
          <Text ref={buttonTextRef} scale={[1.5, 1.5, 1.5]} color="black">
            Play Again
          </Text>
        </motion.group>
      )}
      <OrbitControls
        target={[0, 0, 0]}
        maxPolarAngle={3}
        autoRotate
        autoRotateSpeed={3}
        camera={camera}
      />
    </>
  );
};

const { presencePromise, id } = connect();
const Ctx = createContext<any>(null);

function App() {
  const router = useRouter();
  const [channel, setChannel] = useState<IChannel | null>(null);
  const [self, setSelf] = useState<any>(null);
  const [users, setUsers] = useState<any>([]);

  const [grid, setGrid] = useImmer(() => createGrid());
  const [turn, setTurn] = useState(``);
  const [winner, setWinner] = useState<null | string>(null);
  const [expanded, setExpanded] = useState(true);
  const [hoveringCell, setHoveringCell] = useState<null | number[]>(null);

  const onClick = useCallback(
    (i: number, j: number, k: number) => {
      if (winner) return;
      console.log(users, 'users', turn);
      setGrid(draft => {
        if (grid[i][j][k] !== 0) return;
        draft[i][j][k] = turn;
        if (checkWin(turn, grid, new Vector3(i, j, k))) {
          setWinner(turn);
        }
        channel?.broadcast('down', { data: [i, j, k, turn] });
        setTurn(turn === `X` ? `O` : `X`);
      });
    },
    [channel, users, turn]
  );

  const onReset = () => {
    setGrid(() => createGrid());
    setTurn(winner === `X` ? `O` : `X`);
    setWinner(null);
  };

  useEffect(() => {
    (async () => {
      const presence = await presencePromise;
      const _self = {
        id,
        timestamp: Date.now(),
      };
      setSelf(_self);
      const channel = presence.joinChannel(
        `tic-tac-toe-${router.query.id}`,
        _self
      );
      channel.subscribePeers(peers => {
        const users = [_self, ...peers].filter(user => user && user.timestamp);
        users.sort((a: any, b: any) => a.timestamp - b.timestamp);
        if (users.length === 2 && !turn) {
          setTurn(`X`);
        }
        setUsers(users);
      });
      channel.subscribe('move', ({ payload: cell }: any) => {
        setHoveringCell(cell);
      });
      channel.subscribe('turn', ({ payload: { turn } }: any) => {
        setTurn(turn);
      });

      channel.subscribe('down', ({ payload: { data } }: any) => {
        const [i, j, k, turn] = data;
        setGrid(draft => {
          if (grid[i][j][k] !== 0) return;
          draft[i][j][k] = turn;
          if (checkWin(turn, grid, new Vector3(i, j, k))) {
            setWinner(turn);
          }
          setTurn(turn === `X` ? `O` : `X`);
        });
      });

      setChannel(channel);
    })();

    return () => {
      channel?.leave();
    };
  }, []);

  useEffect(() => {
    if (hoveringCell) {
      if (
        (self.id === users[0].id && turn === `X`) ||
        (self.id === users[1].id && turn === `O`)
      ) {
        channel?.broadcast('move', hoveringCell);
      }
    }
  }, [hoveringCell]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="Container">
        <Ctx.Provider value={{ id, channel, users }}>
          <Canvas
            shadows
            className="CanvasContainer"
            camera={{ position: [-30, -3, 0] }}
          >
            {/* Game stuff */}
            <Center>
              <CustomOrbitControls
                turn={turn}
                winner={winner}
                isStart={users.length >= 2}
                onReset={onReset}
              />
              <Grid />
              <AnimatePresence>
                <ThreeDBoard
                  grid={grid}
                  turn={turn}
                  winner={winner}
                  hoveringCell={hoveringCell}
                />
              </AnimatePresence>
            </Center>

            {/* Environment stuff */}
            <color args={['rgb(6,22,38)']} attach="background" />
            <ambientLight intensity={0.2} />
            <pointLight position={[50, 200, 50]} intensity={0.75} />
            <pointLight position={[-70, -200, 0]} intensity={0.35} />
            <EffectComposer multisampling={8}>
              <Bloom
                blendFunction={BlendFunction.ADD}
                intensity={0.4} // The bloom intensity.
                width={300} // render width
                height={300} // render height
                kernelSize={5} // blur kernel size
                luminanceThreshold={0.2} // luminance threshold. Raise this value to mask out darker elements in the scene.
                luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
              />
              <Bloom
                kernelSize={KernelSize.HUGE}
                width={500} // render width
                height={500} // render height
                luminanceThreshold={0}
                luminanceSmoothing={0}
                intensity={0.1}
              />
            </EffectComposer>
          </Canvas>
          <button
            className={classNames('ExpandButton', { expanded })}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <CloseMenu /> : <BurgerMenu />}
          </button>
          <div className={classNames('BoardContainer', { expanded })}>
            <div className="BoardGrid">
              <TwoDBoard
                grid={grid}
                turn={turn}
                winner={winner}
                onClick={onClick}
                hoveringCell={hoveringCell}
                setHoveringCell={setHoveringCell}
              />
            </div>
          </div>
        </Ctx.Provider>
      </div>
    </Suspense>
  );
}

function ThreeDBoard({
  grid,
  turn,
  winner,
  hoveringCell,
}: {
  grid: any[][][];
  turn: string;
  winner: null | string;
  hoveringCell: null | number[];
}) {
  return (
    <>
      {grid.map((plane, i) =>
        plane.map((row, j) =>
          row.map((item, k) => {
            const isEmpty = item === 0;
            // Dont render empty cells if there is a winner
            if (isEmpty && winner) return;

            const key = getGridItemKey(i, j, k);
            const isHovering =
              i === hoveringCell?.[0] &&
              j === hoveringCell?.[1] &&
              k === hoveringCell?.[2];

            // Dont render empty cells if they are not being hovered
            if (isEmpty && !isHovering) return;

            const blockState = isEmpty ? turn.substring(0, 1) : item;
            console.log(blockState, item, turn);
            // Render empty cells if they are being hovered
            const Block = blockState === 'X' ? XBlock : OBlock;
            return (
              <Block
                opacity={isEmpty ? 0.5 : 1}
                position={[
                  i * BLOCK_DISTANCE,
                  j * BLOCK_DISTANCE,
                  k * BLOCK_DISTANCE,
                ]}
                key={key}
              />
            );
          })
        )
      )}
    </>
  );
}

function TwoDBoard({
  grid,
  turn,
  winner,
  hoveringCell,
  setHoveringCell,
  onClick,
}: {
  grid: any[][][];
  turn: string;
  winner: null | string;
  hoveringCell: null | number[];
  setHoveringCell: (cell: null | number[]) => void;
  onClick: (i: number, j: number, k: number) => void;
}) {
  return (
    <Ctx.Consumer>
      {({ id, channel, users }) =>
        grid.map((plane, i) => (
          <div className="BoardPlane" key={i}>
            {plane.map((row, j) => (
              <React.Fragment key={j}>
                {row.map((item, k) => {
                  const isHovering =
                    i === hoveringCell?.[0] &&
                    j === hoveringCell?.[1] &&
                    k === hoveringCell?.[2];

                  let itemType = null;
                  let opacity = 1;

                  if (item === 0 && isHovering) {
                    itemType = turn;
                    opacity = 0.3;
                  }

                  if (item !== 0) {
                    itemType = item;
                  }

                  if (winner) {
                    itemType = null;
                  }

                  return (
                    <button
                      disabled={
                        users[0]?.id === id ? turn !== 'X' : turn !== 'O'
                      }
                      onMouseEnter={() => setHoveringCell([i, j, k])}
                      onMouseLeave={() => setHoveringCell(null)}
                      className="BoardCell"
                      key={getGridItemKey(i, j, k)}
                      onClick={() => onClick(i, j, k)}
                    >
                      {itemType && (
                        <BoardItem
                          itemType={itemType.substring(0, 1)}
                          opacity={opacity}
                        />
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        ))
      }
    </Ctx.Consumer>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
