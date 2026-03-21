import { FC, SyntheticEvent } from 'react';
import clsx from 'clsx';
import './styles/common-button.css';
import { RefreshIcon } from './icons';

type RefreshButtonProps = {
  onClick: (() => void) | ((e: SyntheticEvent) => void);
  text?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  extraClass?: string;
};

export const RefreshButton: FC<RefreshButtonProps> = ({
  onClick,
  text = 'Обновить',
  htmlType = 'button',
  extraClass = ''
}) => (
  <button
    type={htmlType}
    className={clsx('common_button', extraClass)}
    onClick={onClick}
  >
    <RefreshIcon />
    {text}
  </button>
);
