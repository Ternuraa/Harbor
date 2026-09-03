export const AVATAR_COLORS = [
    { bg: '#EAE6FF', text: '#5D44D5' },
    { bg: '#FFEAEA', text: '#D54444' },
    { bg: '#EAFFEB', text: '#3EAF4A' },
    { bg: '#EAF6FF', text: '#2B86C5' },
    { bg: '#FFF5EA', text: '#D58D44' },
] as const;

export const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

export const getAvatarInitial = (firstName?: string) =>
    firstName ? firstName.charAt(0).toUpperCase() : '';
