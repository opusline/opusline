/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Payments_Remove_FailedInputs */

const en_payments_remove_failed = /** @type {(inputs: Payments_Remove_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The payment could not be removed.`)
};

const fr_payments_remove_failed = /** @type {(inputs: Payments_Remove_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le paiement n'a pas pu être retiré.`)
};

/**
* | output |
* | --- |
* | "The payment could not be removed." |
*
* @param {Payments_Remove_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payments_remove_failed = /** @type {((inputs?: Payments_Remove_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payments_Remove_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payments_remove_failed(inputs)
	return en_payments_remove_failed(inputs)
});