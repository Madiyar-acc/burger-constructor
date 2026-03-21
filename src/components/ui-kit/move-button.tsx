import { FC } from 'react';
import clsx from 'clsx';
import './styles/move-button.css';
import { ArrowDownIcon, ArrowUpIcon } from './icons';

type MoveButtonProps = {
  isUpDisabled: boolean;
  isDownDisabled: boolean;
  handleMoveDown: () => void;
  handleMoveUp: () => void;
  extraClass?: string;
};

export const MoveButton: FC<MoveButtonProps> = ({
  isUpDisabled,
  isDownDisabled,
  handleMoveDown,
  handleMoveUp,
  extraClass = ''
}) => (
  <div className={clsx('move_button_container', extraClass)}>
    <button
      type='button'
      className='move_button'
      disabled={isUpDisabled}
      onClick={handleMoveUp}
    >
      <ArrowUpIcon type={isUpDisabled ? 'disabled' : 'primary'} />
    </button>
    <button
      type='button'
      className='move_button'
      disabled={isDownDisabled}
      onClick={handleMoveDown}
    >
      <ArrowDownIcon type={isDownDisabled ? 'disabled' : 'primary'} />
    </button>
  </div>
);
