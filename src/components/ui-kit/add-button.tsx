import { FC, SyntheticEvent } from 'react';
import clsx from 'clsx';
import './styles/common-button.css';
import { PlusIcon } from './icons';

type AddButtonProps = {
  onClick: (() => void) | ((e: SyntheticEvent) => void);
  text?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  extraClass?: string;
};

export const AddButton: FC<AddButtonProps> = ({
  onClick,
  text = 'Добавить',
  htmlType = 'button',
  extraClass = ''
}) => (
  <button
    type={htmlType}
    className={clsx('common_button', extraClass)}
    onClick={onClick}
  >
    <PlusIcon />
    {text}
  </button>
);
