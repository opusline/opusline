/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Unit_AriaInputs */

const en_expenses_unit_aria = /** @type {(inputs: Expenses_Unit_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amounts shown`)
};

const fr_expenses_unit_aria = /** @type {(inputs: Expenses_Unit_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montants affichés`)
};

/**
* | output |
* | --- |
* | "Amounts shown" |
*
* @param {Expenses_Unit_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_unit_aria = /** @type {((inputs?: Expenses_Unit_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Unit_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_unit_aria(inputs)
	return en_expenses_unit_aria(inputs)
});