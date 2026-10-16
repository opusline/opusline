/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Create_In_Opusline_DetailInputs */

const en_quotes_create_in_opusline_detail = /** @type {(inputs: Quotes_Create_In_Opusline_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validity, deposit, live preview and the PDF filed on validation.`)
};

const fr_quotes_create_in_opusline_detail = /** @type {(inputs: Quotes_Create_In_Opusline_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validité, acompte, aperçu en direct et le PDF classé à la validation.`)
};

/**
* | output |
* | --- |
* | "Validity, deposit, live preview and the PDF filed on validation." |
*
* @param {Quotes_Create_In_Opusline_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_create_in_opusline_detail = /** @type {((inputs?: Quotes_Create_In_Opusline_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Create_In_Opusline_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_create_in_opusline_detail(inputs)
	return en_quotes_create_in_opusline_detail(inputs)
});