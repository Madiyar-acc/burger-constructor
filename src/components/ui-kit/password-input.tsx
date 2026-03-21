import React, { ChangeEvent, FC, useRef, useState } from 'react';
import { Input } from './input';

type TPasswordInputInterface = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'ref' | 'value' | 'onChange'
> & {
  value: string;
  placeholder?: string;
  size?: 'default' | 'small';
  icon?: 'HideIcon' | 'ShowIcon' | 'EditIcon';
  errorText?: string;
  checkValid?: (isValid: boolean) => void;
  extraClass?: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
};

export const PasswordInput: FC<TPasswordInputInterface> = ({
  value,
  placeholder = 'Пароль',
  errorText = 'Некорректный пароль',
  checkValid,
  onChange,
  size,
  icon = 'ShowIcon',
  extraClass = '',
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(icon);
  const [fieldDisabled, setDisabled] = useState(icon === 'EditIcon');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onIconClick = () => {
    if (currentIcon === 'ShowIcon') {
      setVisible(true);
      setCurrentIcon('HideIcon');
    } else {
      setDisabled(false);
      setVisible(true);
    }

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const validateField = (nextValue: string) => {
    const isValid = nextValue.length >= 6;
    setError(!isValid);
    checkValid?.(isValid);
  };

  return (
    <Input
      type={visible ? 'text' : 'password'}
      placeholder={placeholder}
      onChange={onChange}
      icon={currentIcon}
      value={value}
      ref={inputRef}
      onBlur={(e) => {
        if (e?.target.value) {
          validateField(e.target.value);
        } else {
          setError(false);
        }

        if (currentIcon === 'EditIcon') {
          setDisabled(true);
        } else {
          setCurrentIcon('ShowIcon');
        }

        setVisible(false);
      }}
      onFocus={() => setError(false)}
      error={error}
      onIconClick={onIconClick}
      errorText={errorText}
      size={size === 'small' ? 'small' : 'default'}
      disabled={fieldDisabled}
      extraClass={extraClass}
      {...rest}
    />
  );
};
