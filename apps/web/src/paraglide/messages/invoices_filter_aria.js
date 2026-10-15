/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Filter_AriaInputs */

const en_invoices_filter_aria = /** @type {(inputs: Invoices_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filter invoices`)
};

const fr_invoices_filter_aria = /** @type {(inputs: Invoices_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filtrer les factures`)
};

/**
* | output |
* | --- |
* | "Filter invoices" |
*
* @param {Invoices_Filter_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_filter_aria = /** @type {((inputs?: Invoices_Filter_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Filter_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_filter_aria(inputs)
	return en_invoices_filter_aria(inputs)
});