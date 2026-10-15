/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Sheet_HintInputs */



/**
* | output |
* | --- |
* | "The supplier, the HT amount and the debit rhythm." |
*
* @param {Subscriptions_Sheet_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_sheet_hint = /** @type {((inputs?: Subscriptions_Sheet_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Sheet_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le fournisseur, le montant HT et le rythme du prélèvement.")
	return /** @type {LocalizedString} */ ("The supplier, the HT amount and the debit rhythm.")
});