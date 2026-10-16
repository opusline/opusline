/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_Pdf_RemoveInputs */

const en_external_quote_pdf_remove = /** @type {(inputs: External_Quote_Pdf_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove the file`)
};

const fr_external_quote_pdf_remove = /** @type {(inputs: External_Quote_Pdf_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer le fichier`)
};

/**
* | output |
* | --- |
* | "Remove the file" |
*
* @param {External_Quote_Pdf_RemoveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_pdf_remove = /** @type {((inputs?: External_Quote_Pdf_RemoveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_Pdf_RemoveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_pdf_remove(inputs)
	return en_external_quote_pdf_remove(inputs)
});