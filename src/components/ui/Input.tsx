import React from 'react';
import styles from './Input.modules.css';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}