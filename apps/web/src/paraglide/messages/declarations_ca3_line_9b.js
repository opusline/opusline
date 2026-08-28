/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Ca3_Line_9bInputs */

const en_declarations_ca3_line_9b = /** @type {(inputs: Declarations_Ca3_Line_9bInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux réduit 10 %`)
};

const fr_declarations_ca3_line_9b = /** @type {(inputs: Declarations_Ca3_Line_9bInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux réduit 10 %`)
};

/**
* | output |
* | --- |
* | "Taux réduit 10 %" |
*
* @param {Declarations_Ca3_Line_9bInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ca3_line_9b = /** @type {((inputs?: Declarations_Ca3_Line_9bInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ca3_Line_9bInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ca3_line_9b(inputs)
	return en_declarations_ca3_line_9b(inputs)
});