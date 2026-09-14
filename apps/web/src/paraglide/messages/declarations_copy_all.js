/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Copy_AllInputs */

const en_declarations_copy_all = /** @type {(inputs: Declarations_Copy_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy all`)
};

const fr_declarations_copy_all = /** @type {(inputs: Declarations_Copy_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tout copier`)
};

/**
* | output |
* | --- |
* | "Copy all" |
*
* @param {Declarations_Copy_AllInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_copy_all = /** @type {((inputs?: Declarations_Copy_AllInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Copy_AllInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_copy_all(inputs)
	return en_declarations_copy_all(inputs)
});