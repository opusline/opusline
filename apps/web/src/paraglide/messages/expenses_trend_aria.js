/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ unit: NonNullable<unknown> }} Expenses_Trend_AriaInputs */

const en_expenses_trend_aria = /** @type {(inputs: Expenses_Trend_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Expenses ${i?.unit} over twelve months`)
};

const fr_expenses_trend_aria = /** @type {(inputs: Expenses_Trend_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dépenses ${i?.unit} sur douze mois`)
};

/**
* | output |
* | --- |
* | "Expenses {unit} over twelve months" |
*
* @param {Expenses_Trend_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_trend_aria = /** @type {((inputs: Expenses_Trend_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Trend_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_trend_aria(inputs)
	return en_expenses_trend_aria(inputs)
});