/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Regime_Micro_BetterInputs */

const en_expenses_regime_micro_better = /** @type {(inputs: Expenses_Regime_Micro_BetterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The micro-BNC regime stays the better one.`)
};

const fr_expenses_regime_micro_better = /** @type {(inputs: Expenses_Regime_Micro_BetterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le régime micro-BNC reste plus favorable.`)
};

/**
* | output |
* | --- |
* | "The micro-BNC regime stays the better one." |
*
* @param {Expenses_Regime_Micro_BetterInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_regime_micro_better = /** @type {((inputs?: Expenses_Regime_Micro_BetterInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Regime_Micro_BetterInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_regime_micro_better(inputs)
	return en_expenses_regime_micro_better(inputs)
});