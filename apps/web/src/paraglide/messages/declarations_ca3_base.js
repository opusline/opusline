/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Ca3_BaseInputs */

const en_declarations_ca3_base = /** @type {(inputs: Declarations_Ca3_BaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`base HT`)
};

const fr_declarations_ca3_base = /** @type {(inputs: Declarations_Ca3_BaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`base HT`)
};

/**
* | output |
* | --- |
* | "base HT" |
*
* @param {Declarations_Ca3_BaseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ca3_base = /** @type {((inputs?: Declarations_Ca3_BaseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ca3_BaseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ca3_base(inputs)
	return en_declarations_ca3_base(inputs)
});