/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Ca3_Line_Rate_OtherInputs */

const en_declarations_ca3_line_rate_other = /** @type {(inputs: Declarations_Ca3_Line_Rate_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line for your rate`)
};

const fr_declarations_ca3_line_rate_other = /** @type {(inputs: Declarations_Ca3_Line_Rate_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ligne du taux applicable`)
};

/**
* | output |
* | --- |
* | "Line for your rate" |
*
* @param {Declarations_Ca3_Line_Rate_OtherInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ca3_line_rate_other = /** @type {((inputs?: Declarations_Ca3_Line_Rate_OtherInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ca3_Line_Rate_OtherInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ca3_line_rate_other(inputs)
	return en_declarations_ca3_line_rate_other(inputs)
});