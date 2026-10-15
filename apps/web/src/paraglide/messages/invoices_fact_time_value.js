/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Fact_Time_ValueInputs */

const en_invoices_fact_time_value = /** @type {(inputs: Invoices_Fact_Time_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time value`)
};

const fr_invoices_fact_time_value = /** @type {(inputs: Invoices_Fact_Time_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valeur du temps`)
};

/**
* | output |
* | --- |
* | "Time value" |
*
* @param {Invoices_Fact_Time_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_fact_time_value = /** @type {((inputs?: Invoices_Fact_Time_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Fact_Time_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_fact_time_value(inputs)
	return en_invoices_fact_time_value(inputs)
});