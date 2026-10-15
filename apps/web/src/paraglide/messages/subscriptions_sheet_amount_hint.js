/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Sheet_Amount_HintInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le nouveau montant vaut à partir de la date choisie ; les dépenses passées gardent l'ancien.")
	return /** @type {LocalizedString} */ ("The new amount applies from the chosen date; past expenses keep the old one.")
});