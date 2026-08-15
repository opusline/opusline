/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Status_LateInputs */

const en_invoice_status_late = /** @type {(inputs: Invoice_Status_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Late`)
};

const fr_invoice_status_late = /** @type {(inputs: Invoice_Status_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En retard`)
};

/**
* | output |
* | --- |
* | "Late" |
*
* @param {Invoice_Status_LateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_status_late = /** @type {((inputs?: Invoice_Status_LateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Status_LateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_status_late(inputs)
	return en_invoice_status_late(inputs)
});