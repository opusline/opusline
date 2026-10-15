/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Calc_Net_Zero_ValueInputs */

const en_expenses_calc_net_zero_value = /** @type {(inputs: Expenses_Calc_Net_Zero_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0 € net`)
};

const fr_expenses_calc_net_zero_value = /** @type {(inputs: Expenses_Calc_Net_Zero_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0 € net`)
};

/**
* | output |
* | --- |
* | "0 € net" |
*
* @param {Expenses_Calc_Net_Zero_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_calc_net_zero_value = /** @type {((inputs?: Expenses_Calc_Net_Zero_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Calc_Net_Zero_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_calc_net_zero_value(inputs)
	return en_expenses_calc_net_zero_value(inputs)
});