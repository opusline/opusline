/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Calc_Net_ZeroInputs */

const en_expenses_calc_net_zero = /** @type {(inputs: Expenses_Calc_Net_ZeroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`due and deducted → 0 € net`)
};

const fr_expenses_calc_net_zero = /** @type {(inputs: Expenses_Calc_Net_ZeroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`due et déduite → 0 € net`)
};

/**
* | output |
* | --- |
* | "due and deducted → 0 € net" |
*
* @param {Expenses_Calc_Net_ZeroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_calc_net_zero = /** @type {((inputs?: Expenses_Calc_Net_ZeroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Calc_Net_ZeroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_calc_net_zero(inputs)
	return en_expenses_calc_net_zero(inputs)
});