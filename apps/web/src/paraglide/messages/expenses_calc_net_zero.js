/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Calc_Net_ZeroInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("due et déduite → 0 € net")
	return /** @type {LocalizedString} */ ("due and deducted → 0 € net")
});