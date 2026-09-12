/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Regime_Real_BetterInputs */

const en_expenses_regime_real_better = /** @type {(inputs: Expenses_Regime_Real_BetterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The real regime would become the better one.`)
};

const fr_expenses_regime_real_better = /** @type {(inputs: Expenses_Regime_Real_BetterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le régime réel deviendrait plus favorable.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_regime_real_better(inputs)
	return en_expenses_regime_real_better(inputs)
});