/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Payment_ClearedInputs */

const en_declarations_payment_cleared = /** @type {(inputs: Declarations_Payment_ClearedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment removed`)
};

const fr_declarations_payment_cleared = /** @type {(inputs: Declarations_Payment_ClearedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paiement retiré`)
};

/**
* | output |
* | --- |
* | "Payment removed" |
*
* @param {Declarations_Payment_ClearedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_payment_cleared = /** @type {((inputs?: Declarations_Payment_ClearedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Payment_ClearedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_payment_cleared(inputs)
	return en_declarations_payment_cleared(inputs)
});