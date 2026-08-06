import { useSyncExternalStore } from 'react';

import dbJson from '../db.json';
import type { Property } from '../types/property';

let properties: Property[] = dbJson.properties as Property[];
let dbRevision = 0;

const listeners = new Set<() => void>();

const subscribeToDb = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const getDbRevision = () => dbRevision;

const notifyDbChange = () => {
    dbRevision += 1;
    listeners.forEach((listener) => listener());
};

const applyDbModule = (mod: unknown) => {
    const next = (mod as { default?: { properties?: Property[] } })?.default
        ?? (mod as { properties?: Property[] });

    if (Array.isArray(next?.properties)) {
        properties = next.properties;
        notifyDbChange();
    }
};

/** Каталог объектов из локальной базы данных */
export const getProperties = (): Property[] => properties;

export const getPropertyById = (id: number): Property | undefined =>
    properties.find((property) => property.id === id);

/** Ревизия db.json — меняется при сохранении файла в dev */
export const useDbRevision = () =>
    useSyncExternalStore(subscribeToDb, getDbRevision, getDbRevision);

/** Объект из db.json с автообновлением при изменении базы */
export const usePropertyFromDb = (id: number): Property | undefined => {
    useDbRevision();
    return getPropertyById(id);
};

/** Все объекты из db.json с автообновлением при изменении базы */
export const usePropertiesFromDb = (): Property[] => {
    useDbRevision();
    return getProperties();
};

if (import.meta.hot) {
    import.meta.hot.accept('../db.json', (mod) => {
        applyDbModule(mod);
    });
}
