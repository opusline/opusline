/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Col_HtInputs */

const en_expenses_col_ht = /** @type {(inputs: Expenses_Col_HtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`HT`)
};

const fr_expenses_col_ht = /** @type {(inputs: Expenses_Col_HtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`HT`)
};

/**
* | output |
* | --- |
* | "HT" |
*
* @param {Expenses_Col_HtInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_col_ht = /** @type {((inputs?: Expenses_Col_HtInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Col_HtInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_col_ht(inputs)
	return en_expenses_col_ht(inputs)
});