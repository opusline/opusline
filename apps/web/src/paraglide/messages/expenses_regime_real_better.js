/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Regime_Real_BetterInputs */



/**
* | output |
* | --- |
* | "The real regime would become the better one." |
*
* @param {Expenses_Regime_Real_BetterInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_regime_real_better = /** @type {((inputs?: Expenses_Regime_Real_BetterInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Regime_Real_BetterInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le régime réel deviendrait plus favorable.")
	return /** @type {LocalizedString} */ ("The real regime would become the better one.")
});