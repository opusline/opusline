/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Periods_NoneInputs */

const en_invoices_periods_none = /** @type {(inputs: Invoices_Periods_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`nothing awaiting an invoice`)
};

const fr_invoices_periods_none = /** @type {(inputs: Invoices_Periods_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`rien en attente de facture`)
};

/**
* | output |
* | --- |
* | "nothing awaiting an invoice" |
*
* @param {Invoices_Periods_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_periods_none = /** @type {((inputs?: Invoices_Periods_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Periods_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_periods_none(inputs)
	return en_invoices_periods_none(inputs)
});