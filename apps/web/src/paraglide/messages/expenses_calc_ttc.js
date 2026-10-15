/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Calc_TtcInputs */

const en_expenses_calc_ttc = /** @type {(inputs: Expenses_Calc_TtcInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TTC`)
};

const fr_expenses_calc_ttc = /** @type {(inputs: Expenses_Calc_TtcInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TTC`)
};

/**
* | output |
* | --- |
* | "TTC" |
*
* @param {Expenses_Calc_TtcInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_calc_ttc = /** @type {((inputs?: Expenses_Calc_TtcInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Calc_TtcInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_calc_ttc(inputs)
	return en_expenses_calc_ttc(inputs)
});