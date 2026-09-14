/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, month: NonNullable<unknown> }} Expenses_Kpi_Deferred_LineInputs */

const en_expenses_kpi_deferred_line = /** @type {(inputs: Expenses_Kpi_Deferred_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ ${i?.amount} deferred · CA3 ${i?.month}`)
};

const fr_expenses_kpi_deferred_line = /** @type {(inputs: Expenses_Kpi_Deferred_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ ${i?.amount} reportés · CA3 ${i?.month}`)
};

/**
* | output |
* | --- |
* | "+ {amount} deferred · CA3 {month}" |
*
* @param {Expenses_Kpi_Deferred_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_deferred_line = /** @type {((inputs: Expenses_Kpi_Deferred_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Deferred_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_deferred_line(inputs)
	return en_expenses_kpi_deferred_line(inputs)
});