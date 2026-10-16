/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_Pdf_HintInputs */

const en_external_quote_pdf_hint = /** @type {(inputs: External_Quote_Pdf_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF or scan, up to 20 MB. It is filed under the client, with their other documents.`)
};

const fr_external_quote_pdf_hint = /** @type {(inputs: External_Quote_Pdf_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF ou scan, jusqu'à 20 Mo. Il est classé sous le client, avec ses autres documents.`)
};

/**
* | output |
* | --- |
* | "PDF or scan, up to 20 MB. It is filed under the client, with their other documents." |
*
* @param {External_Quote_Pdf_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_pdf_hint = /** @type {((inputs?: External_Quote_Pdf_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_Pdf_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_pdf_hint(inputs)
	return en_external_quote_pdf_hint(inputs)
});