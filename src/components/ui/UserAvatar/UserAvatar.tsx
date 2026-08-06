import React, { useMemo } from 'react';

import styles from './UserAvatar.module.scss';
import { getAvatarColor, getAvatarInitial } from '../../../utils/avatar';

type UserAvatarSize = 'sm' | 'md' | 'lg';

interface UserAvatarProps {
    firstName?: string;
    avatarUrl?: string | null;
    size?: UserAvatarSize;
    className?: string;
    editable?: boolean;
    editLabel?: string;
    onClick?: () => void;
    ariaLabel?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
    firstName,
    avatarUrl,
    size = 'md',
    className,
    editable = false,
    editLabel,
    onClick,
    ariaLabel,
}) => {
    const initial = getAvatarInitial(firstName);
    const colorStyle = useMemo(() => {
        if (!firstName) {
            return { backgroundColor: '#EAFFEB', color: '#3EAF4A' };
        }

        const colors = getAvatarColor(firstName);
        return {
            backgroundColor: colors.bg,
            color: colors.text,
        };
    }, [firstName]);

    const sizeClass = styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}` as 'sizeSm' | 'sizeMd' | 'sizeLg'];
    const rootClassName = [
        styles.avatar,
        sizeClass,
        editable ? styles.interactive : '',
        className ?? '',
    ].filter(Boolean).join(' ');

    const content = avatarUrl ? (
        <img src={avatarUrl} alt="" className={styles.image} />
    ) : (
        initial
    );

    if (editable && onClick) {
        return (
            <button
                type="button"
                className={rootClassName}
                style={avatarUrl ? undefined : colorStyle}
                onClick={onClick}
                aria-label={ariaLabel}
            >
                {content}
                {editLabel && <span className={styles.editBadge}>{editLabel}</span>}
            </button>
        );
    }

    return (
        <div
            className={rootClassName}
            style={avatarUrl ? undefined : colorStyle}
            aria-hidden={editable ? undefined : true}
        >
            {content}
        </div>
    );
};
