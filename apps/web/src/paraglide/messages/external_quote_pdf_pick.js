/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_Pdf_PickInputs */

const en_external_quote_pdf_pick = /** @type {(inputs: External_Quote_Pdf_PickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a file`)
};

const fr_external_quote_pdf_pick = /** @type {(inputs: External_Quote_Pdf_PickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisir un fichier`)
};

/**
* | output |
* | --- |
* | "Choose a file" |
*
* @param {External_Quote_Pdf_PickInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_pdf_pick = /** @type {((inputs?: External_Quote_Pdf_PickInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_Pdf_PickInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_pdf_pick(inputs)
	return en_external_quote_pdf_pick(inputs)
});