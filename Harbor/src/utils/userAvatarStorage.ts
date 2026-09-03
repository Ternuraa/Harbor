const AVATAR_KEY_PREFIX = 'harbor-avatar-';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const AVATAR_OUTPUT_SIZE = 256;

const buildAvatarKey = (userId: number) => `${AVATAR_KEY_PREFIX}${userId}`;

export const getStoredAvatarUrl = (userId: number): string | null => {
    try {
        return localStorage.getItem(buildAvatarKey(userId));
    } catch {
        return null;
    }
};

export const saveStoredAvatarUrl = (userId: number, dataUrl: string) => {
    try {
        localStorage.setItem(buildAvatarKey(userId), dataUrl);
    } catch {
        throw new Error('storage_failed');
    }
};

export const clearStoredAvatarUrl = (userId: number) => {
    try {
        localStorage.removeItem(buildAvatarKey(userId));
    } catch {
        // ignore
    }
};

const loadImage = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('invalid_image'));
        };

        image.src = url;
    });

export const processAvatarFile = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
        throw new Error('invalid_type');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('too_large');
    }

    const image = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_OUTPUT_SIZE;
    canvas.height = AVATAR_OUTPUT_SIZE;

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('canvas_unavailable');
    }

    const scale = Math.max(AVATAR_OUTPUT_SIZE / image.width, AVATAR_OUTPUT_SIZE / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const offsetX = (AVATAR_OUTPUT_SIZE - width) / 2;
    const offsetY = (AVATAR_OUTPUT_SIZE - height) / 2;

    context.drawImage(image, offsetX, offsetY, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    if (!dataUrl.startsWith('data:image/')) {
        throw new Error('encode_failed');
    }

    return dataUrl;
};
