/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Kind_Ca3Inputs */

const en_declarations_kind_ca3 = /** @type {(inputs: Declarations_Kind_Ca3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA3`)
};

const fr_declarations_kind_ca3 = /** @type {(inputs: Declarations_Kind_Ca3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA3`)
};

/**
* | output |
* | --- |
* | "CA3" |
*
* @param {Declarations_Kind_Ca3Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_kind_ca3 = /** @type {((inputs?: Declarations_Kind_Ca3Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Kind_Ca3Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_kind_ca3(inputs)
	return en_declarations_kind_ca3(inputs)
});