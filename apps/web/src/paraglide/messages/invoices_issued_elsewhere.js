/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Issued_ElsewhereInputs */

const en_invoices_issued_elsewhere = /** @type {(inputs: Invoices_Issued_ElsewhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`issued elsewhere`)
};

const fr_invoices_issued_elsewhere = /** @type {(inputs: Invoices_Issued_ElsewhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`émise ailleurs`)
};

/**
* | output |
* | --- |
* | "issued elsewhere" |
*
* @param {Invoices_Issued_ElsewhereInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_issued_elsewhere = /** @type {((inputs?: Invoices_Issued_ElsewhereInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Issued_ElsewhereInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_issued_elsewhere(inputs)
	return en_invoices_issued_elsewhere(inputs)
});