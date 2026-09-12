/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Expenses_Kpi_Reverse_LineInputs */

const en_expenses_kpi_reverse_line = /** @type {(inputs: Expenses_Kpi_Reverse_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ ${i?.amount} reverse charged`)
};

const fr_expenses_kpi_reverse_line = /** @type {(inputs: Expenses_Kpi_Reverse_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ ${i?.amount} autoliquidés`)
};

/**
* | output |
* | --- |
* | "+ {amount} reverse charged" |
*
* @param {Expenses_Kpi_Reverse_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_reverse_line = /** @type {((inputs: Expenses_Kpi_Reverse_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Reverse_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_reverse_line(inputs)
	return en_expenses_kpi_reverse_line(inputs)
});