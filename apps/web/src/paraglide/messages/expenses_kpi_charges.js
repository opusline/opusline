/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Kpi_ChargesInputs */

const en_expenses_kpi_charges = /** @type {(inputs: Expenses_Kpi_ChargesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This month's charges`)
};

const fr_expenses_kpi_charges = /** @type {(inputs: Expenses_Kpi_ChargesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Charges du mois`)
};

/**
* | output |
* | --- |
* | "This month's charges" |
*
* @param {Expenses_Kpi_ChargesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_charges = /** @type {((inputs?: Expenses_Kpi_ChargesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_ChargesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_charges(inputs)
	return en_expenses_kpi_charges(inputs)
});