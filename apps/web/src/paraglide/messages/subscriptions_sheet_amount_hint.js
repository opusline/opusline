/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Sheet_Amount_HintInputs */

const en_subscriptions_sheet_amount_hint = /** @type {(inputs: Subscriptions_Sheet_Amount_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The new amount applies from the chosen date; past expenses keep the old one.`)
};

const fr_subscriptions_sheet_amount_hint = /** @type {(inputs: Subscriptions_Sheet_Amount_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le nouveau montant vaut à partir de la date choisie ; les dépenses passées gardent l'ancien.`)
};

/**
* | output |
* | --- |
* | "The new amount applies from the chosen date; past expenses keep the old one." |
*
* @param {Subscriptions_Sheet_Amount_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_sheet_amount_hint = /** @type {((inputs?: Subscriptions_Sheet_Amount_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Sheet_Amount_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_sheet_amount_hint(inputs)
	return en_subscriptions_sheet_amount_hint(inputs)
});