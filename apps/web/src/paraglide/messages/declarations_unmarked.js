/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_UnmarkedInputs */

const en_declarations_unmarked = /** @type {(inputs: Declarations_UnmarkedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark removed`)
};

const fr_declarations_unmarked = /** @type {(inputs: Declarations_UnmarkedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquage annulé`)
};

/**
* | output |
* | --- |
* | "Mark removed" |
*
* @param {Declarations_UnmarkedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_unmarked = /** @type {((inputs?: Declarations_UnmarkedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_UnmarkedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_unmarked(inputs)
	return en_declarations_unmarked(inputs)
});