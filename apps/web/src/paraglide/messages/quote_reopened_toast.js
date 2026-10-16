/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Quote_Reopened_ToastInputs */

const en_quote_reopened_toast = /** @type {(inputs: Quote_Reopened_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quote ${i?.number} sent again`)
};

const fr_quote_reopened_toast = /** @type {(inputs: Quote_Reopened_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Devis ${i?.number} renvoyé`)
};

/**
* | output |
* | --- |
* | "Quote {number} sent again" |
*
* @param {Quote_Reopened_ToastInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_reopened_toast = /** @type {((inputs: Quote_Reopened_ToastInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Reopened_ToastInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_reopened_toast(inputs)
	return en_quote_reopened_toast(inputs)
});