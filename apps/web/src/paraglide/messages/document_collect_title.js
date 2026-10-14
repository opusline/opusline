/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Collect_TitleInputs */

const en_document_collect_title = /** @type {(inputs: Document_Collect_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment`)
};

const fr_document_collect_title = /** @type {(inputs: Document_Collect_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Encaissement`)
};

/**
* | output |
* | --- |
* | "Payment" |
*
* @param {Document_Collect_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_collect_title = /** @type {((inputs?: Document_Collect_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Collect_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_collect_title(inputs)
	return en_document_collect_title(inputs)
});