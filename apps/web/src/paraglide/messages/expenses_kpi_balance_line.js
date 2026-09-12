/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ collected: NonNullable<unknown>, balance: NonNullable<unknown> }} Expenses_Kpi_Balance_LineInputs */

const en_expenses_kpi_balance_line = /** @type {(inputs: Expenses_Kpi_Balance_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA collected ${i?.collected} → ${i?.balance} to pay`)
};

const fr_expenses_kpi_balance_line = /** @type {(inputs: Expenses_Kpi_Balance_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA collectée ${i?.collected} → solde à payer ${i?.balance}`)
};

/**
* | output |
* | --- |
* | "TVA collected {collected} → {balance} to pay" |
*
* @param {Expenses_Kpi_Balance_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_balance_line = /** @type {((inputs: Expenses_Kpi_Balance_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Balance_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_balance_line(inputs)
	return en_expenses_kpi_balance_line(inputs)
});