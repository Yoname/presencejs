import { FC } from 'react';
import O from './svgs/o.svg';
import X from './svgs/x.svg';

//For 2D grid
type BoardItemProps = {
  itemType: string;
  opacity?: number;
};

const BoardItem: FC<BoardItemProps> = ({ itemType, opacity }) => {
  return itemType === 'X' ? (
    <X
      className="BoardItem"
      style={{
        opacity: opacity || 1,
      }}
    />
  ) : (
    <O
      className="BoardItem"
      style={{
        opacity: opacity || 1,
      }}
    />
  );
};

export default BoardItem;
