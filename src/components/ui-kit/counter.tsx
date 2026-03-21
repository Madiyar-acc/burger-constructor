import { FC } from 'react';
import clsx from 'clsx';
import './styles/counter.css';

type CounterProps = {
  count: number;
  size?: 'default' | 'small';
  extraClass?: string;
};

export const Counter: FC<CounterProps> = ({
  count,
  size = 'default',
  extraClass = ''
}) => (
  <div className={clsx('counter', size, extraClass)}>
    <p className='counter__num'>{count}</p>
  </div>
);
