/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Kpi_Vat_DeductibleInputs */



/**
* | output |
* | --- |
* | "TVA to deduct" |
*
* @param {Expenses_Kpi_Vat_DeductibleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_vat_deductible = /** @type {((inputs?: Expenses_Kpi_Vat_DeductibleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Vat_DeductibleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("TVA à déduire")
	return /** @type {LocalizedString} */ ("TVA to deduct")
});