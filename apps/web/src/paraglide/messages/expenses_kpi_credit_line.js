/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ credit: NonNullable<unknown>, collected: NonNullable<unknown> }} Expenses_Kpi_Credit_LineInputs */

const en_expenses_kpi_credit_line = /** @type {(inputs: Expenses_Kpi_Credit_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA credit ${i?.credit} · deducted > collected (${i?.collected}) · carried to the next CA3`)
};

const fr_expenses_kpi_credit_line = /** @type {(inputs: Expenses_Kpi_Credit_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Crédit de TVA ${i?.credit} · déduite > collectée (${i?.collected}) · reporté sur la CA3 suivante`)
};

/**
* | output |
* | --- |
* | "TVA credit {credit} · deducted > collected ({collected}) · carried to the next CA3" |
*
* @param {Expenses_Kpi_Credit_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_credit_line = /** @type {((inputs: Expenses_Kpi_Credit_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Credit_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_credit_line(inputs)
	return en_expenses_kpi_credit_line(inputs)
});