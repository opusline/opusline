/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Ca3_Line_09Inputs */

const en_declarations_ca3_line_09 = /** @type {(inputs: Declarations_Ca3_Line_09Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux réduit 5,5 %`)
};

const fr_declarations_ca3_line_09 = /** @type {(inputs: Declarations_Ca3_Line_09Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux réduit 5,5 %`)
};

/**
* | output |
* | --- |
* | "Taux réduit 5,5 %" |
*
* @param {Declarations_Ca3_Line_09Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ca3_line_09 = /** @type {((inputs?: Declarations_Ca3_Line_09Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ca3_Line_09Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ca3_line_09(inputs)
	return en_declarations_ca3_line_09(inputs)
});