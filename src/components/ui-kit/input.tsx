import React, {
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import clsx from 'clsx';
import './styles/input.css';
import { EditIcon, HideIcon, ShowIcon } from './icons';

const inputIcons = {
  EditIcon,
  HideIcon,
  ShowIcon
};

type TInputInterface = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'onChange'
> & {
  value: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  success?: boolean;
  error?: boolean;
  disabled?: boolean;
  icon?: keyof typeof inputIcons;
  errorText?: string;
  size?: 'default' | 'small';
  extraClass?: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  onIconClick?(e: MouseEvent<HTMLDivElement>): void;
  onBlur?(e?: FocusEvent<HTMLInputElement>): void;
  onFocus?(e?: FocusEvent<HTMLInputElement>): void;
};

const useCombinedRefs = (
  ...refs: Array<React.Ref<HTMLInputElement> | undefined>
) => {
  const targetRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(targetRef.current);
        return;
      }

      if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current =
          targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

export const Input = forwardRef<HTMLInputElement, TInputInterface>(
  (
    {
      type,
      placeholder,
      onChange,
      icon,
      onIconClick,
      error,
      value,
      errorText,
      disabled,
      onBlur,
      onFocus,
      size = 'default',
      extraClass = '',
      ...rest
    },
    forwardedRef
  ) => {
    const [focus, setFocus] = useState(false);
    const innerRef = useRef<HTMLInputElement>(null);
    const ref = useCombinedRefs(innerRef, forwardedRef);

    const handleInputFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setFocus(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const forceFocus = useCallback(() => {
      ref.current?.focus();
    }, [ref]);

    const handleInputBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setFocus(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    const onIconClickProxy = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (onIconClick) {
          onIconClick(e);
          return;
        }

        forceFocus();
      },
      [forceFocus, onIconClick]
    );

    const iconToRender = useMemo(() => {
      const Icon = icon ? inputIcons[icon] : undefined;
      const hasAction = typeof onIconClick === 'function';
      const isDisabledIcon = disabled && !hasAction;

      if (!Icon) {
        return null;
      }

      return (
        <div
          className={clsx('input__icon', {
            'input__icon-action': hasAction,
            'input__icon-disabled': isDisabledIcon
          })}
          onClick={onIconClickProxy}
        >
          <Icon type={isDisabledIcon ? 'secondary' : 'primary'} />
        </div>
      );
    }, [disabled, icon, onIconClick, onIconClickProxy]);

    return (
      <div className={`input__container ${extraClass}`}>
        <div
          className={clsx('input', {
            'pr-6 pl-6': size === 'default',
            [`input_type_${type}`]: type,
            [`input_size_${size}`]: size,
            input_status_error: error,
            input_status_disabled: disabled,
            input_status_active: focus
          })}
          onClick={forceFocus}
        >
          <label
            className={clsx('input__placeholder text noselect', {
              [`text_type_main-${size}`]: size,
              'input__placeholder-focused': focus,
              'input__placeholder-filled': value,
              'input__placeholder-disabled': disabled
            })}
          >
            {placeholder}
          </label>
          <input
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className={clsx('text', 'input__textfield', {
              [`text_type_main-${size}`]: size,
              'input__textfield-disabled': disabled
            })}
            type={type}
            ref={ref}
            onChange={onChange}
            value={value}
            disabled={disabled}
            {...rest}
          />
          {iconToRender}
        </div>
        {error && errorText && (
          <p className={clsx('input__error', `text_type_main-${size}`)}>
            {errorText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
