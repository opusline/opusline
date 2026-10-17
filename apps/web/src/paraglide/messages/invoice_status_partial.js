/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Status_PartialInputs */

const en_invoice_status_partial = /** @type {(inputs: Invoice_Status_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partly paid`)
};

const fr_invoice_status_partial = /** @type {(inputs: Invoice_Status_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partiellement payée`)
};

/**
* | output |
* | --- |
* | "Partly paid" |
*
* @param {Invoice_Status_PartialInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_status_partial = /** @type {((inputs?: Invoice_Status_PartialInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Status_PartialInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_status_partial(inputs)
	return en_invoice_status_partial(inputs)
});