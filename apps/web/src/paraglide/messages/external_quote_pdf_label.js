/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_Pdf_LabelInputs */

const en_external_quote_pdf_label = /** @type {(inputs: External_Quote_Pdf_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF of the quote (optional)`)
};

const fr_external_quote_pdf_label = /** @type {(inputs: External_Quote_Pdf_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF du devis (facultatif)`)
};

/**
* | output |
* | --- |
* | "PDF of the quote (optional)" |
*
* @param {External_Quote_Pdf_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_pdf_label = /** @type {((inputs?: External_Quote_Pdf_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_Pdf_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_pdf_label(inputs)
	return en_external_quote_pdf_label(inputs)
});