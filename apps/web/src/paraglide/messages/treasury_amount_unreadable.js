/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Amount_UnreadableInputs */



/**
* | output |
* | --- |
* | "Enter an amount." |
*
* @param {Treasury_Amount_UnreadableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_amount_unreadable = /** @type {((inputs?: Treasury_Amount_UnreadableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Amount_UnreadableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Indiquez un montant.")
	return /** @type {LocalizedString} */ ("Enter an amount.")
});