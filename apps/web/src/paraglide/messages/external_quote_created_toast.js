/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} External_Quote_Created_ToastInputs */

const en_external_quote_created_toast = /** @type {(inputs: External_Quote_Created_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quote ${i?.number} added`)
};

const fr_external_quote_created_toast = /** @type {(inputs: External_Quote_Created_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Devis ${i?.number} ajouté`)
};

/**
* | output |
* | --- |
* | "Quote {number} added" |
*
* @param {External_Quote_Created_ToastInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_created_toast = /** @type {((inputs: External_Quote_Created_ToastInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_Created_ToastInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_created_toast(inputs)
	return en_external_quote_created_toast(inputs)
});