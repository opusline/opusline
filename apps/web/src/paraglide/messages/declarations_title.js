/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_TitleInputs */

const en_declarations_title = /** @type {(inputs: Declarations_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Declarations`)
};

const fr_declarations_title = /** @type {(inputs: Declarations_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déclarations`)
};

/**
* | output |
* | --- |
* | "Declarations" |
*
* @param {Declarations_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_title = /** @type {((inputs?: Declarations_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_title(inputs)
	return en_declarations_title(inputs)
});