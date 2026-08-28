/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Ca3_Line_08Inputs */

const en_declarations_ca3_line_08 = /** @type {(inputs: Declarations_Ca3_Line_08Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux normal 20 %`)
};

const fr_declarations_ca3_line_08 = /** @type {(inputs: Declarations_Ca3_Line_08Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux normal 20 %`)
};

/**
* | output |
* | --- |
* | "Taux normal 20 %" |
*
* @param {Declarations_Ca3_Line_08Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ca3_line_08 = /** @type {((inputs?: Declarations_Ca3_Line_08Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ca3_Line_08Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ca3_line_08(inputs)
	return en_declarations_ca3_line_08(inputs)
});