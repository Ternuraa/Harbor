const WEBP_PATTERN = /\.webp$/i;
const RETINA_SUFFIX = '@2x.webp';
/** Vite prod: /assets/name-HASH.webp — @2x-файла в dist нет */
const VITE_HASHED_ASSET_PATTERN = /\/assets\/.+-[A-Za-z0-9_-]+\.webp$/i;

/** Строит srcset для WebP с 1x и @2x вариантами */
export function buildRetinaSrcSet(src: string): string | undefined {
    if (!WEBP_PATTERN.test(src) || src.includes('@2x')) {
        return undefined;
    }

    if (VITE_HASHED_ASSET_PATTERN.test(src)) {
        return undefined;
    }

    const retinaSrc = src.replace(WEBP_PATTERN, RETINA_SUFFIX);
    return `${src} 1x, ${retinaSrc} 2x`;
}

export function buildRetinaSrcSetPair(oneX: string, twoX: string): string {
    return `${oneX} 1x, ${twoX} 2x`;
}

export function getRetinaImageProps(src: string) {
    const srcSet = buildRetinaSrcSet(src);

    return srcSet
        ? { src, srcSet }
        : { src };
}

/** Для импортированных Vite-ассетов: base URL + optional @2x рядом в public не нужен */
export function isPublicImagePath(src: string): boolean {
    return src.startsWith('/images/') || src.startsWith('/assets/');
}
