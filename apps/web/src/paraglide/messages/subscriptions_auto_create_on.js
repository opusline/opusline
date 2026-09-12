/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Auto_Create_OnInputs */

const en_subscriptions_auto_create_on = /** @type {(inputs: Subscriptions_Auto_Create_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`At each debit an expense is added to the month at the amount then in force. Only the receipt is left to link.`)
};

const fr_subscriptions_auto_create_on = /** @type {(inputs: Subscriptions_Auto_Create_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À chaque prélèvement, une dépense est ajoutée au mois avec le montant en vigueur. Il ne vous reste qu'à lier la facture.`)
};

/**
* | output |
* | --- |
* | "At each debit an expense is added to the month at the amount then in force. Only the receipt is left to link." |
*
* @param {Subscriptions_Auto_Create_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_auto_create_on = /** @type {((inputs?: Subscriptions_Auto_Create_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Auto_Create_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_auto_create_on(inputs)
	return en_subscriptions_auto_create_on(inputs)
});