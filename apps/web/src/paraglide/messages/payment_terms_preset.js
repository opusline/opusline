/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Payment_Terms_PresetInputs */

const en_payment_terms_preset = /** @type {(inputs: Payment_Terms_PresetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} d`)
};

const fr_payment_terms_preset = /** @type {(inputs: Payment_Terms_PresetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} j`)
};

/**
* | output |
* | --- |
* | "{days} d" |
*
* @param {Payment_Terms_PresetInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payment_terms_preset = /** @type {((inputs: Payment_Terms_PresetInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payment_Terms_PresetInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payment_terms_preset(inputs)
	return en_payment_terms_preset(inputs)
});