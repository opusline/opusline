/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Pending_None_SuggestedInputs */



/**
* | output |
* | --- |
* | "no suggestions waiting" |
*
* @param {Bank_Pending_None_SuggestedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_pending_none_suggested = /** @type {((inputs?: Bank_Pending_None_SuggestedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Pending_None_SuggestedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("aucune suggestion en attente")
	return /** @type {LocalizedString} */ ("no suggestions waiting")
});