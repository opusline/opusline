/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Mode_TypeInputs */

const en_expenses_mode_type = /** @type {(inputs: Expenses_Mode_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type it`)
};

const fr_expenses_mode_type = /** @type {(inputs: Expenses_Mode_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisir`)
};

/**
* | output |
* | --- |
* | "Type it" |
*
* @param {Expenses_Mode_TypeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_mode_type = /** @type {((inputs?: Expenses_Mode_TypeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Mode_TypeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_mode_type(inputs)
	return en_expenses_mode_type(inputs)
});