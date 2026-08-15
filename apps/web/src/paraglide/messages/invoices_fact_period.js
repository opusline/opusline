/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Fact_PeriodInputs */

const en_invoices_fact_period = /** @type {(inputs: Invoices_Fact_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period`)
};

const fr_invoices_fact_period = /** @type {(inputs: Invoices_Fact_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Période`)
};

/**
* | output |
* | --- |
* | "Period" |
*
* @param {Invoices_Fact_PeriodInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_fact_period = /** @type {((inputs?: Invoices_Fact_PeriodInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Fact_PeriodInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_fact_period(inputs)
	return en_invoices_fact_period(inputs)
});