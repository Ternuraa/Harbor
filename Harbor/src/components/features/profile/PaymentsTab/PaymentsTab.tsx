import React, { useEffect, useState } from 'react';

import styles from './PaymentsTab.module.scss';

import { Input } from '../../../ui/Input/Input';

import { Button } from '../../../ui/Button/Button';

import { useTranslation } from '../../../../i18n/useTranslation';

import {

    addSavedCard,

    deleteSavedCard,

    getLoyaltyPoints,

    getSavedCards,

    type SavedCard,

} from '../../../../utils/paymentsStorage';



const PromoCodeItem = ({

    title,

    description,

    date,

    code,

    copyLabel,

    copiedLabel,

}: {

    title: string;

    description: string;

    date: string;

    code: string;

    copyLabel: string;

    copiedLabel: string;

}) => {

    const [copied, setCopied] = useState(false);



    const handleCopy = () => {

        navigator.clipboard.writeText(code).then(() => {

            setCopied(true);

            setTimeout(() => setCopied(false), 2000);

        });

    };



    return (

        <div className={styles.promoCard}>

            <div className={styles.promoText}>

                <h4>{title}</h4>

                <p>{description}</p>

                <div className={styles.promoDate}>{date}</div>

            </div>

            <div className={styles.promoAction}>

                <span className={styles.promoCodeVal}>{code}</span>

                <button

                    type="button"

                    className={`${styles.btnOutline} ${copied ? styles.copied : ''}`}

                    onClick={handleCopy}

                >

                    {copied ? copiedLabel : copyLabel}

                </button>

            </div>

        </div>

    );

};



export const PaymentsTab: React.FC = () => {

    const { dictionary } = useTranslation();

    const labels = dictionary.profile.payments;



    const [loyaltyPoints, setLoyaltyPoints] = useState(() => getLoyaltyPoints());

    const [savedCards, setSavedCards] = useState<SavedCard[]>(() => getSavedCards());

    const [isAddingCard, setIsAddingCard] = useState(false);



    const [cardNumber, setCardNumber] = useState('');

    const [cardExpiry, setCardExpiry] = useState('');

    const [cardCvc, setCardCvc] = useState('');

    const [cardName, setCardName] = useState('');



    useEffect(() => {
        const refresh = () => {
            setLoyaltyPoints(getLoyaltyPoints());
            setSavedCards(getSavedCards());
        };

        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);



    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const val = e.target.value.replace(/\D/g, '');

        const formatted = val.replace(/(.{4})/g, '$1 ').trim();

        if (formatted.length <= 19) setCardNumber(formatted);

    };



    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        let val = e.target.value.replace(/\D/g, '');

        if (val.length > 2) val = `${val.substring(0, 2)} / ${val.substring(2, 4)}`;

        if (val.length <= 7) setCardExpiry(val);

    };



    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const val = e.target.value.replace(/\D/g, '');

        if (val.length <= 3) setCardCvc(val);

    };



    const handleSaveCard = (e: React.FormEvent) => {

        e.preventDefault();

        if (cardNumber.length < 19) {

            alert(labels.fullCardError);

            return;

        }



        addSavedCard({
            last4: cardNumber.slice(-4),
            expiry: cardExpiry,
            brand: cardNumber.startsWith('4') ? 'VISA' : cardNumber.startsWith('5') ? 'Mastercard' : 'МИР',
        });

        setSavedCards(getSavedCards());

        setIsAddingCard(false);

        setCardNumber('');

        setCardExpiry('');

        setCardCvc('');

        setCardName('');

    };



    const handleDeleteCard = (cardId: string) => {

        setSavedCards(deleteSavedCard(cardId));

    };



    const pointsNeededForGold = 500;

    const pointsLeft = Math.max(0, pointsNeededForGold - loyaltyPoints);

    const progressPercent = Math.min(100, (loyaltyPoints / pointsNeededForGold) * 100);



    return (

        <div className={styles.tabContainer}>

            <h1 className={styles.sectionTitle}>{labels.title}</h1>



            <div className={`${styles.cardBlock} ${loyaltyPoints > 0 ? styles.noBorder : ''}`}>

                <div className={styles.cardHeader} style={{ marginBottom: '16px' }}>

                    <h3>{labels.loyaltyTitle}</h3>

                </div>



                <div className={styles.premiumLoyaltyCard}>

                    <div className={styles.loyaltyHeader}>

                        <div className={styles.loyaltyBrand}>{labels.clubBrand.split(' ')[0]} <span>{labels.clubBrand.split(' ')[1]}</span></div>

                        <div className={styles.loyaltyTier}>

                            {loyaltyPoints >= 500 ? labels.clubTierGold : labels.clubTierSilver}

                        </div>

                    </div>

                    <div className={styles.loyaltyBalanceArea}>

                        <div className={styles.loyaltyPoints}>{loyaltyPoints} <span>{labels.points}</span></div>

                        <div className={styles.loyaltyFiat}>

                            {labels.pointsEquivalent.replace('{points}', String(loyaltyPoints))}

                        </div>

                    </div>

                    <div className={styles.loyaltyProgressArea}>

                        <div className={styles.loyaltyProgressText}>

                            <span>{labels.untilGold} <strong>{labels.clubTierGold}</strong></span>

                            <span>{labels.pointsLeft.replace('{count}', String(pointsLeft))}</span>

                        </div>

                        <div className={styles.loyaltyBarBg}>

                            <div className={styles.loyaltyBarFill} style={{ width: `${progressPercent}%` }} />

                        </div>

                    </div>

                </div>

            </div>



            <div className={styles.cardBlock}>

                <div className={styles.cardHeader} style={{ marginBottom: '24px' }}>

                    <h3>{labels.promosTitle}</h3>

                </div>

                <div className={styles.promoList}>

                    <PromoCodeItem

                        title={labels.promoWelcomeTitle}

                        description={labels.promoWelcomeDescription}

                        date={labels.promoWelcomeDate}

                        code="WELCOME15"

                        copyLabel={labels.copy}

                        copiedLabel={labels.copied}

                    />

                </div>

            </div>



            <div className={styles.cardBlock}>

                <div className={styles.cardHeader}>

                    <h3>{labels.paymentMethodsTitle}</h3>

                    {!isAddingCard && (

                        <button type="button" className={styles.btnText} onClick={() => setIsAddingCard(true)}>

                            {labels.addCard}

                        </button>

                    )}

                </div>



                {savedCards.length === 0 && !isAddingCard && (

                    <p style={{ color: '#8F8F8F', fontSize: '14px', margin: 0 }}>{labels.noCards}</p>

                )}



                {!isAddingCard && savedCards.length > 0 && (

                    <div className={styles.savedCardsList}>

                        {savedCards.map((card) => (

                            <div key={card.id} className={styles.paymentMethod}>

                                <div className={styles.cardIcon}>{card.brand}</div>

                                <div className={styles.paymentMethodInfo}>

                                    <div className={styles.cardNumberText}>•••• {card.last4}</div>

                                    <div className={styles.cardMetaText}>{labels.expires} {card.expiry}</div>

                                </div>



                                <div className={styles.cardActions}>

                                    {card.isDefault && <span className={styles.defaultBadge}>{labels.default}</span>}

                                    <button

                                        type="button"

                                        className={styles.deleteCardBtn}

                                        onClick={() => handleDeleteCard(card.id)}

                                    >

                                        {labels.delete}

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}



                {isAddingCard && (

                    <form onSubmit={handleSaveCard} className={styles.addCardForm}>

                        <div className={styles.formGroup} style={{ marginBottom: '16px' }}>

                            <label className={styles.label}>{labels.cardNumber}</label>

                            <Input

                                type="text"

                                placeholder="0000 0000 0000 0000"

                                value={cardNumber}

                                onChange={handleCardNumberChange}

                                required

                            />

                        </div>



                        <div className={styles.formRow}>

                            <div className={styles.formGroup}>

                                <label className={styles.label}>{labels.expiry}</label>

                                <Input

                                    type="text"

                                    placeholder="ММ / ГГ"

                                    value={cardExpiry}

                                    onChange={handleExpiryChange}

                                    required

                                />

                            </div>

                            <div className={styles.formGroup}>

                                <label className={styles.label}>{labels.cvc}</label>

                                <Input

                                    type="password"

                                    placeholder="•••"

                                    value={cardCvc}

                                    onChange={handleCvcChange}

                                    required

                                />

                            </div>

                        </div>



                        <div className={styles.formGroup} style={{ marginBottom: '24px' }}>

                            <label className={styles.label}>{labels.cardholder}</label>

                            <Input

                                type="text"

                                placeholder={labels.cardholder}

                                value={cardName}

                                onChange={(e) => setCardName(e.target.value.toUpperCase())}

                                required

                            />

                        </div>



                        <div style={{ display: 'flex', gap: '12px' }}>

                            <Button type="submit">{labels.saveCard}</Button>

                            <Button type="button" onClick={() => setIsAddingCard(false)} className={styles.btnCancel}>

                                {labels.cancel}

                            </Button>

                        </div>

                    </form>

                )}

            </div>

        </div>

    );

};


