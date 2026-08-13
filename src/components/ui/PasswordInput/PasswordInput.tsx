import React, { useState, type InputHTMLAttributes } from 'react';
import { Input } from '../Input/Input';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';
import styles from './PasswordInput.module.scss';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const PasswordInput: React.FC<PasswordInputProps> = ({
    disabled,
    ...inputProps
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className={styles.passwordWrapper}>
            <Input
                type={visible ? 'text' : 'password'}
                disabled={disabled}
                {...inputProps}
            />
            <button
                type="button"
                className={styles.eyeButton}
                disabled={disabled}
                aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
                onClick={() => setVisible((prev) => !prev)}
            >
                {visible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    );
};
