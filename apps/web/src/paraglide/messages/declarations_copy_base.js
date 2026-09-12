/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Copy_BaseInputs */

const en_declarations_copy_base = /** @type {(inputs: Declarations_Copy_BaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy the taxable base`)
};

const fr_declarations_copy_base = /** @type {(inputs: Declarations_Copy_BaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copier la base imposable`)
};

/**
* | output |
* | --- |
* | "Copy the taxable base" |
*
* @param {Declarations_Copy_BaseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_copy_base = /** @type {((inputs?: Declarations_Copy_BaseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Copy_BaseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_copy_base(inputs)
	return en_declarations_copy_base(inputs)
});