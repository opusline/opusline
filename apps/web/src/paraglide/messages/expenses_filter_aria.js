/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Filter_AriaInputs */

const en_expenses_filter_aria = /** @type {(inputs: Expenses_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filter the expenses`)
};

const fr_expenses_filter_aria = /** @type {(inputs: Expenses_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filtrer les dépenses`)
};

/**
* | output |
* | --- |
* | "Filter the expenses" |
*
* @param {Expenses_Filter_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_filter_aria = /** @type {((inputs?: Expenses_Filter_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Filter_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_filter_aria(inputs)
	return en_expenses_filter_aria(inputs)
});