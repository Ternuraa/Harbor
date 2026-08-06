import React, { useState, useEffect } from 'react';
import styles from './NotificationsTab.module.scss';
import { ToggleSwitch } from '../../../ui/ToggleSwitch/ToggleSwitch';

export const NotificationsTab: React.FC = () => {
    const [pushNotifications, setPushNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 1. ПОЛУЧЕНИЕ НАСТРОЕК С БЭКЕНДА
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                // Имитируем ответ от сервера
                const data = { push: false };

                // Важно: если в самом браузере пуши УЖЕ разрешены, 
                // мы синхронизируем тумблер с браузером
                if ('Notification' in window && Notification.permission === 'granted') {
                    setPushNotifications(true);
                } else {
                    setPushNotifications(data.push);
                }
            } catch (error) {
                console.error('Ошибка при загрузке настроек:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // 2. ОТПРАВКА НА СЕРВЕР
    const updateSettingOnServer = async (settingName: 'push', newValue: boolean) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`Настройка ${settingName} успешно сохранена: ${newValue}`);
        } catch (error) {
            console.error(error);
            alert('Произошла ошибка при сохранении.');
            if (settingName === 'push') setPushNotifications(!newValue);
        }
    };

    // 3. ФУНКЦИЯ ПОКАЗА РЕАЛЬНОГО УВЕДОМЛЕНИЯ В БРАУЗЕРЕ
    const showTestNotification = () => {
        new Notification('Харбор', {
            body: 'Push-уведомления успешно включены! 🚀',
            // icon: '/favicon.ico' // Можно раскомментировать, если есть иконка
        });
    };

    // 4. ГЛАВНЫЙ ОБРАБОТЧИК КЛИКА ПО ТУМБЛЕРУ
    const handleTogglePush = async (checked: boolean) => {
        // Мгновенно переключаем тумблер визуально
        setPushNotifications(checked);

        if (checked) {
            // Проверяем, поддерживает ли браузер пуши вообще
            if (!('Notification' in window)) {
                console.warn('Ваш браузер не поддерживает push-уведомления.');
                setPushNotifications(false);
                return;
            }

            // Если уже разрешено — показываем тестовый пуш
            if (Notification.permission === 'granted') {
                showTestNotification();
                updateSettingOnServer('push', true);
            }
            // 🛑 ЕСЛИ БРАУЗЕР В РЕЖИМЕ "СПРАШИВАТЬ" (ПО УМОЛЧАНИЮ)
            else if (Notification.permission !== 'denied') {
                setTimeout(async () => {
                    // Вот эта команда вызывает системное окно!
                    const permission = await Notification.requestPermission();

                    if (permission === 'granted') {
                        showTestNotification();
                        updateSettingOnServer('push', true);
                    } else {
                        // Юзер нажал "Блокировать" или закрыл окно
                        setPushNotifications(false);
                    }
                }, 100);
            }
            // 🛑 ЕСЛИ БРАУЗЕР ЖЕСТКО БЛОКИРУЕТ (убираем alert)
            else {
                // Просто молча отщелкиваем тумблер назад, так как браузер не даст показать окно
                console.warn('Уведомления заблокированы в настройках браузера.');
                setPushNotifications(false);
            }
        } else {
            // Если выключили тумблер — просто сохраняем на сервере
            updateSettingOnServer('push', false);
        }
    };
    if (isLoading) {
        return <div style={{ padding: '40px', color: '#8F8F8F' }}>Загрузка настроек...</div>;
    }

    return (
        <div className={styles.tabContainer}>
            <h1 className={styles.sectionTitle}>Уведомления</h1>

            <div className={styles.cardBlock}>
                <div className={styles.cardHeader}>
                    <h3>Сообщения от хозяев</h3>
                </div>

                <div className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                        <h4>Push-уведомления</h4>
                        <p>Уведомления в браузере</p>
                    </div>
                    <ToggleSwitch
                        checked={pushNotifications}
                        onChange={handleTogglePush}
                    />
                </div>
            </div>
        </div>
    );
};