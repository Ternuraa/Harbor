import React from 'react';
import { buildRetinaSrcSet } from '../../../utils/imageSrcSet';
import styles from './ResponsiveImage.module.scss';

type ResponsiveImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> & {
    src: string;
    alt: string;
    srcSet?: string;
    /** Отключить автоматический @2x srcset */
    disableRetina?: boolean;
};

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
    src,
    alt,
    srcSet: srcSetProp,
    disableRetina = false,
    loading = 'lazy',
    decoding = 'async',
    className,
    ...props
}) => {
    const srcSet = srcSetProp ?? (!disableRetina ? buildRetinaSrcSet(src) : undefined);
    const imageClassName = [styles.image, className].filter(Boolean).join(' ');

    if (!srcSet) {
        return (
            <img
                src={src}
                alt={alt}
                className={imageClassName}
                loading={loading}
                decoding={decoding}
                {...props}
            />
        );
    }

    return (
        <picture className={styles.picture}>
            <source srcSet={srcSet} type="image/webp" />
            <img
                src={src}
                srcSet={srcSet}
                alt={alt}
                className={imageClassName}
                loading={loading}
                decoding={decoding}
                {...props}
            />
        </picture>
    );
};
