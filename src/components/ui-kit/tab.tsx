import React, { FC, PropsWithChildren, useCallback } from 'react';
import clsx from 'clsx';
import './styles/tab.css';

type TabProps = PropsWithChildren<{
  active: boolean;
  value: string;
  onClick: (value: string) => void;
}>;

export const Tab: FC<TabProps> = ({ active, value, children, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(value);
  }, [onClick, value]);

  return (
    <div
      className={clsx(
        'tab',
        { tab_type_current: active },
        'pt-4',
        'pr-10',
        'pb-4',
        'pl-10',
        'noselect'
      )}
      onClick={handleClick}
    >
      <span className='text text_type_main-default'>{children}</span>
    </div>
  );
};
