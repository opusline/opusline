/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ unit: NonNullable<unknown> }} Expenses_Trend_TitleInputs */

const en_expenses_trend_title = /** @type {(inputs: Expenses_Trend_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Expenses ${i?.unit} · 12 months`)
};

const fr_expenses_trend_title = /** @type {(inputs: Expenses_Trend_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dépenses ${i?.unit} · 12 mois`)
};

/**
* | output |
* | --- |
* | "Expenses {unit} · 12 months" |
*
* @param {Expenses_Trend_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_trend_title = /** @type {((inputs: Expenses_Trend_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Trend_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_trend_title(inputs)
	return en_expenses_trend_title(inputs)
});