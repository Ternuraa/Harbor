import React from 'react';
import clsx from 'clsx';
import styles from './PageLayout.module.scss';

type ContainerVariant = 'default' | 'narrow' | 'flush' | 'none';

type PageLayoutProps = {
    children: React.ReactNode;
    id?: string;
    className?: string;
    containerClassName?: string;
    container?: ContainerVariant;
};

export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    id = 'main-content',
    className,
    containerClassName,
    container = 'default',
}) => {
    const containerClass =
        container === 'narrow'
            ? styles.containerNarrow
            : container === 'flush'
              ? styles.containerFlush
              : container === 'none'
                ? undefined
                : styles.container;

    return (
        <main id={id} className={clsx(styles.page, className)}>
            {container === 'none' ? (
                children
            ) : (
                <div className={clsx(containerClass, containerClassName)}>{children}</div>
            )}
        </main>
    );
};
