import React from 'react';
import styles from './Stepper.module.scss';

interface StepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export const Stepper: React.FC<StepperProps> = ({ value, onChange, min = 0, max = 16 }) => {
    const handleMinus = () => {
        if (value > min) onChange(value - 1);
    };

    const handlePlus = () => {
        if (value < max) onChange(value + 1);
    };

    return (
        <div className={styles.stepper}>
            <button
                type="button"
                className={`${styles.btn} ${value <= min ? styles.disabled : ''}`}
                onClick={handleMinus}
                disabled={value <= min}
            >
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentcolor', strokeWidth: 5.33333, overflow: 'visible' }}><path d="m2 16h28"></path></svg>
            </button>

            <span className={styles.value}>{value}</span>

            <button
                type="button"
                className={`${styles.btn} ${value >= max ? styles.disabled : ''}`}
                onClick={handlePlus}
                disabled={value >= max}
            >
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentcolor', strokeWidth: 5.33333, overflow: 'visible' }}><path d="m2 16h28m-14-14v28"></path></svg>
            </button>
        </div>
    );
};