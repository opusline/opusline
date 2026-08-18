/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Fact_RemainingInputs */

const en_invoices_fact_remaining = /** @type {(inputs: Invoices_Fact_RemainingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Left to invoice`)
};

const fr_invoices_fact_remaining = /** @type {(inputs: Invoices_Fact_RemainingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reste à facturer`)
};

/**
* | output |
* | --- |
* | "Left to invoice" |
*
* @param {Invoices_Fact_RemainingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_fact_remaining = /** @type {((inputs?: Invoices_Fact_RemainingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Fact_RemainingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_fact_remaining(inputs)
	return en_invoices_fact_remaining(inputs)
});