/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Pay_FailedInputs */

const en_invoices_pay_failed = /** @type {(inputs: Invoices_Pay_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The payment could not be recorded.`)
};

const fr_invoices_pay_failed = /** @type {(inputs: Invoices_Pay_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'encaissement n'a pas pu être enregistré.`)
};

/**
* | output |
* | --- |
* | "The payment could not be recorded." |
*
* @param {Invoices_Pay_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_pay_failed = /** @type {((inputs?: Invoices_Pay_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Pay_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_pay_failed(inputs)
	return en_invoices_pay_failed(inputs)
});