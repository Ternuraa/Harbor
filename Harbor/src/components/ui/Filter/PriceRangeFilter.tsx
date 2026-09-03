import React from 'react';
import styles from './PriceRangeFilter.module.scss';
import { useTranslation } from '../../../i18n/useTranslation';
import { getLocaleForNumber } from '../../../utils/localizeProperty';

interface PriceRangeFilterProps {
    min: number;
    max: number;
    valueMin: number;
    valueMax: number;
    onChange: (min: number, max: number) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
    min,
    max,
    valueMin,
    valueMax,
    onChange,
}) => {
    const { t, language } = useTranslation();
    const locale = getLocaleForNumber(language);
    const formatPrice = (value: number) => `${value.toLocaleString(locale)} ₽`;

    const handleMinChange = (nextMin: number) => {
        onChange(Math.min(nextMin, valueMax), valueMax);
    };

    const handleMaxChange = (nextMax: number) => {
        onChange(valueMin, Math.max(nextMax, valueMin));
    };

    const minPercent = max === min ? 0 : ((valueMin - min) / (max - min)) * 100;
    const maxPercent = max === min ? 100 : ((valueMax - min) / (max - min)) * 100;

    return (
        <div className={styles.wrapper}>
            <div className={styles.values}>
                <span>{formatPrice(valueMin)}</span>
                <span>—</span>
                <span>{formatPrice(valueMax)}</span>
            </div>

            <div className={styles.sliderTrack}>
                <div
                    className={styles.sliderRange}
                    style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={100}
                    value={valueMin}
                    className={styles.sliderInput}
                    onChange={(e) => handleMinChange(Number(e.target.value))}
                    aria-label={t('filters.priceFrom')}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={100}
                    value={valueMax}
                    className={styles.sliderInput}
                    onChange={(e) => handleMaxChange(Number(e.target.value))}
                    aria-label={t('filters.priceTo')}
                />
            </div>

            <div className={styles.inputs}>
                <label className={styles.field}>
                    <span className={styles.fieldLabel}>{t('filters.priceFrom')}</span>
                    <input
                        type="number"
                        min={min}
                        max={max}
                        step={100}
                        value={valueMin}
                        onChange={(e) => handleMinChange(Number(e.target.value))}
                    />
                </label>
                <label className={styles.field}>
                    <span className={styles.fieldLabel}>{t('filters.priceTo')}</span>
                    <input
                        type="number"
                        min={min}
                        max={max}
                        step={100}
                        value={valueMax}
                        onChange={(e) => handleMaxChange(Number(e.target.value))}
                    />
                </label>
            </div>
        </div>
    );
};
