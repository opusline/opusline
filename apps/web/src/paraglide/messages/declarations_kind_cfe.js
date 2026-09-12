/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Kind_CfeInputs */

const en_declarations_kind_cfe = /** @type {(inputs: Declarations_Kind_CfeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE`)
};

const fr_declarations_kind_cfe = /** @type {(inputs: Declarations_Kind_CfeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE`)
};

/**
* | output |
* | --- |
* | "CFE" |
*
* @param {Declarations_Kind_CfeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_kind_cfe = /** @type {((inputs?: Declarations_Kind_CfeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Kind_CfeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_kind_cfe(inputs)
	return en_declarations_kind_cfe(inputs)
});