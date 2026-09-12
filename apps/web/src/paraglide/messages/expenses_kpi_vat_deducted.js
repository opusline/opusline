/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Kpi_Vat_DeductedInputs */

const en_expenses_kpi_vat_deducted = /** @type {(inputs: Expenses_Kpi_Vat_DeductedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA deducted`)
};

const fr_expenses_kpi_vat_deducted = /** @type {(inputs: Expenses_Kpi_Vat_DeductedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA déduite`)
};

/**
* | output |
* | --- |
* | "TVA deducted" |
*
* @param {Expenses_Kpi_Vat_DeductedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_vat_deducted = /** @type {((inputs?: Expenses_Kpi_Vat_DeductedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Vat_DeductedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_vat_deducted(inputs)
	return en_expenses_kpi_vat_deducted(inputs)
});