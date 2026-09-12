/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Copy_TaxInputs */

const en_declarations_copy_tax = /** @type {(inputs: Declarations_Copy_TaxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy the TVA collected`)
};

const fr_declarations_copy_tax = /** @type {(inputs: Declarations_Copy_TaxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copier la TVA collectée`)
};

/**
* | output |
* | --- |
* | "Copy the TVA collected" |
*
* @param {Declarations_Copy_TaxInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_copy_tax = /** @type {((inputs?: Declarations_Copy_TaxInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Copy_TaxInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_copy_tax(inputs)
	return en_declarations_copy_tax(inputs)
});