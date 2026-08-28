/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Ca3_Line_A1Inputs */

const en_declarations_ca3_line_a1 = /** @type {(inputs: Declarations_Ca3_Line_A1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ventes, prestations de services`)
};

const fr_declarations_ca3_line_a1 = /** @type {(inputs: Declarations_Ca3_Line_A1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ventes, prestations de services`)
};

/**
* | output |
* | --- |
* | "Ventes, prestations de services" |
*
* @param {Declarations_Ca3_Line_A1Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ca3_line_a1 = /** @type {((inputs?: Declarations_Ca3_Line_A1Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ca3_Line_A1Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ca3_line_a1(inputs)
	return en_declarations_ca3_line_a1(inputs)
});