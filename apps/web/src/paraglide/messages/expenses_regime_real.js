/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Regime_RealInputs */

const en_expenses_regime_real = /** @type {(inputs: Expenses_Regime_RealInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Real charges · projection`)
};

const fr_expenses_regime_real = /** @type {(inputs: Expenses_Regime_RealInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Charges réelles · projection`)
};

/**
* | output |
* | --- |
* | "Real charges · projection" |
*
* @param {Expenses_Regime_RealInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_regime_real = /** @type {((inputs?: Expenses_Regime_RealInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Regime_RealInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_regime_real(inputs)
	return en_expenses_regime_real(inputs)
});