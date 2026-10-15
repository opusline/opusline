/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Regime_AbatementInputs */



/**
* | output |
* | --- |
* | "Micro-BNC allowance · 34 %" |
*
* @param {Expenses_Regime_AbatementInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_regime_abatement = /** @type {((inputs?: Expenses_Regime_AbatementInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Regime_AbatementInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Abattement micro-BNC · 34 %")
	return /** @type {LocalizedString} */ ("Micro-BNC allowance · 34 %")
});