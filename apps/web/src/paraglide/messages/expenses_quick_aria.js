/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Quick_AriaInputs */

const en_expenses_quick_aria = /** @type {(inputs: Expenses_Quick_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quick entry`)
};

const fr_expenses_quick_aria = /** @type {(inputs: Expenses_Quick_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisie rapide`)
};

/**
* | output |
* | --- |
* | "Quick entry" |
*
* @param {Expenses_Quick_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_quick_aria = /** @type {((inputs?: Expenses_Quick_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Quick_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_quick_aria(inputs)
	return en_expenses_quick_aria(inputs)
});