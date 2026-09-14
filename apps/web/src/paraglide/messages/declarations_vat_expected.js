/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Vat_ExpectedInputs */

const en_declarations_vat_expected = /** @type {(inputs: Declarations_Vat_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA expected`)
};

const fr_declarations_vat_expected = /** @type {(inputs: Declarations_Vat_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA attendue`)
};

/**
* | output |
* | --- |
* | "TVA expected" |
*
* @param {Declarations_Vat_ExpectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_vat_expected = /** @type {((inputs?: Declarations_Vat_ExpectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Vat_ExpectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_vat_expected(inputs)
	return en_declarations_vat_expected(inputs)
});