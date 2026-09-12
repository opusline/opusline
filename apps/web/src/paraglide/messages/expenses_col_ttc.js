/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Col_TtcInputs */

const en_expenses_col_ttc = /** @type {(inputs: Expenses_Col_TtcInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TTC`)
};

const fr_expenses_col_ttc = /** @type {(inputs: Expenses_Col_TtcInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TTC`)
};

/**
* | output |
* | --- |
* | "TTC" |
*
* @param {Expenses_Col_TtcInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_col_ttc = /** @type {((inputs?: Expenses_Col_TtcInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Col_TtcInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_col_ttc(inputs)
	return en_expenses_col_ttc(inputs)
});