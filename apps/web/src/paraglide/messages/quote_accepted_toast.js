/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Quote_Accepted_ToastInputs */

const en_quote_accepted_toast = /** @type {(inputs: Quote_Accepted_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quote ${i?.number} accepted`)
};

const fr_quote_accepted_toast = /** @type {(inputs: Quote_Accepted_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Devis ${i?.number} accepté`)
};

/**
* | output |
* | --- |
* | "Quote {number} accepted" |
*
* @param {Quote_Accepted_ToastInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_accepted_toast = /** @type {((inputs: Quote_Accepted_ToastInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Accepted_ToastInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_accepted_toast(inputs)
	return en_quote_accepted_toast(inputs)
});