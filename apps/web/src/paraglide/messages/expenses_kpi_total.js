/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ unit: NonNullable<unknown> }} Expenses_Kpi_TotalInputs */

const en_expenses_kpi_total = /** @type {(inputs: Expenses_Kpi_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Expenses ${i?.unit}`)
};

const fr_expenses_kpi_total = /** @type {(inputs: Expenses_Kpi_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dépenses ${i?.unit}`)
};

/**
* | output |
* | --- |
* | "Expenses {unit}" |
*
* @param {Expenses_Kpi_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_total = /** @type {((inputs: Expenses_Kpi_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_total(inputs)
	return en_expenses_kpi_total(inputs)
});