/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Term_On_ReceiptInputs */

const en_invoicing_term_on_receipt = /** @type {(inputs: Invoicing_Term_On_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On receipt`)
};

const fr_invoicing_term_on_receipt = /** @type {(inputs: Invoicing_Term_On_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À réception`)
};

/**
* | output |
* | --- |
* | "On receipt" |
*
* @param {Invoicing_Term_On_ReceiptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_term_on_receipt = /** @type {((inputs?: Invoicing_Term_On_ReceiptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Term_On_ReceiptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_term_on_receipt(inputs)
	return en_invoicing_term_on_receipt(inputs)
});