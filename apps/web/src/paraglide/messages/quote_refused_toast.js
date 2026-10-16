/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Quote_Refused_ToastInputs */

const en_quote_refused_toast = /** @type {(inputs: Quote_Refused_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quote ${i?.number} refused`)
};

const fr_quote_refused_toast = /** @type {(inputs: Quote_Refused_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Devis ${i?.number} refusé`)
};

/**
* | output |
* | --- |
* | "Quote {number} refused" |
*
* @param {Quote_Refused_ToastInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_refused_toast = /** @type {((inputs: Quote_Refused_ToastInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Refused_ToastInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_refused_toast(inputs)
	return en_quote_refused_toast(inputs)
});