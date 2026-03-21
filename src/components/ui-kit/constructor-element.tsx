import { FC } from 'react';
import clsx from 'clsx';
import './styles/constructor-element.css';
import { CurrencyIcon, DeleteIcon, LockIcon } from './icons';

type ConstructorElementProps = {
  text: string;
  thumbnail: string;
  price: number;
  type?: 'top' | 'bottom';
  isLocked?: boolean;
  extraClass?: string;
  handleClose?: () => void;
};

export const ConstructorElement: FC<ConstructorElementProps> = ({
  type,
  text,
  thumbnail,
  price,
  isLocked,
  extraClass = '',
  handleClose
}) => {
  const action = isLocked ? (
    <LockIcon type='secondary' />
  ) : (
    <DeleteIcon type='primary' onClick={handleClose} />
  );

  return (
    <div
      className={clsx(
        'constructor-element',
        type && `constructor-element_pos_${type}`,
        extraClass
      )}
    >
      <span className='constructor-element__row'>
        <img
          className='constructor-element__image'
          src={thumbnail}
          alt={text}
        />
        <span className='constructor-element__text'>{text}</span>
        <span className='constructor-element__price'>
          {price}
          <CurrencyIcon type='primary' />
        </span>
        <span className='constructor-element__action pr-2'>{action}</span>
      </span>
    </div>
  );
};
