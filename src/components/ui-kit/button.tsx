import React, { FC, PropsWithChildren, SyntheticEvent } from 'react';
import clsx from 'clsx';
import './styles/button.css';

type ButtonProps = PropsWithChildren<
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
> & {
  type?: 'secondary' | 'primary';
  size?: 'small' | 'medium' | 'large';
  onClick?: (() => void) | ((e: SyntheticEvent) => void);
  extraClass?: string;
  htmlType: 'button' | 'submit' | 'reset';
};

export const Button: FC<ButtonProps> = ({
  children,
  type = 'primary',
  size = 'medium',
  onClick,
  htmlType,
  extraClass = '',
  ...rest
}) => {
  const className = clsx(
    'button',
    `button_type_${type}`,
    `button_size_${size}`,
    extraClass
  );

  return (
    <button type={htmlType} onClick={onClick} className={className} {...rest}>
      {children}
    </button>
  );
};
