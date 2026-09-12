/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Empty_Filter_TitleInputs */

const en_expenses_empty_filter_title = /** @type {(inputs: Expenses_Empty_Filter_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No expense in this filter`)
};

const fr_expenses_empty_filter_title = /** @type {(inputs: Expenses_Empty_Filter_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune dépense dans ce filtre`)
};

/**
* | output |
* | --- |
* | "No expense in this filter" |
*
* @param {Expenses_Empty_Filter_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_empty_filter_title = /** @type {((inputs?: Expenses_Empty_Filter_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Empty_Filter_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_empty_filter_title(inputs)
	return en_expenses_empty_filter_title(inputs)
});