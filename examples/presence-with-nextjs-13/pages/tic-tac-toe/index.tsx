import Link from 'next/link';
import { useState } from 'react';

export default function TicTacToe() {
  const [roomId, setRoomId] = useState<string>('');
  const [joinId, setJoinId] = useState<string>(''); 

  const createRoom = async () => {
    setRoomId(Math.random().toString(36).substring(7));
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center">Tic Tac Toe</h1>
      {/* create a room */}
      <button
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={createRoom}
      >
        Create Room
      </button>
      {/* your room id */}
      {roomId && (
        // copy to clipboard
        <div
          className="flex items-center justify-between px-4 py-2 mt-4 text-black bg-white rounded cursor-pointer"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(roomId);
              alert('Copied to clipboard!');
            } catch (e) {
              console.log(e);
            }
          }}
        >
          <span>{roomId}</span>
        </div>
      )}
      {/* join a room */}
      <input
        type="text"
        placeholder="Enter room id"
        className="px-4 py-2 mt-4 text-black bg-white rounded"
        onChange={(e) => setJoinId(e.target.value)}
        value={joinId}
      />
      <Link href={`/tic-tac-toe/${joinId}`}>
        <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
          Join Room
        </button>
      </Link>
    </div>
  );
}
