/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, month: NonNullable<unknown> }} Expenses_Kpi_Regularised_LineInputs */

const en_expenses_kpi_regularised_line = /** @type {(inputs: Expenses_Kpi_Regularised_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ ${i?.amount} deferred · box 21, CA3 ${i?.month}`)
};

const fr_expenses_kpi_regularised_line = /** @type {(inputs: Expenses_Kpi_Regularised_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ ${i?.amount} reportés · case 21, CA3 ${i?.month}`)
};

/**
* | output |
* | --- |
* | "+ {amount} deferred · box 21, CA3 {month}" |
*
* @param {Expenses_Kpi_Regularised_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_regularised_line = /** @type {((inputs: Expenses_Kpi_Regularised_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Regularised_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_regularised_line(inputs)
	return en_expenses_kpi_regularised_line(inputs)
});