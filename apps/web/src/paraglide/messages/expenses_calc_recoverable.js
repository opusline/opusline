/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Calc_RecoverableInputs */

const en_expenses_calc_recoverable = /** @type {(inputs: Expenses_Calc_RecoverableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recoverable`)
};

const fr_expenses_calc_recoverable = /** @type {(inputs: Expenses_Calc_RecoverableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Récupérable`)
};

/**
* | output |
* | --- |
* | "Recoverable" |
*
* @param {Expenses_Calc_RecoverableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_calc_recoverable = /** @type {((inputs?: Expenses_Calc_RecoverableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Calc_RecoverableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_calc_recoverable(inputs)
	return en_expenses_calc_recoverable(inputs)
});