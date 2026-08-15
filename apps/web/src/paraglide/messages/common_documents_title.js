/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Documents_TitleInputs */

const en_common_documents_title = /** @type {(inputs: Common_Documents_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documents`)
};

const fr_common_documents_title = /** @type {(inputs: Common_Documents_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documents`)
};

/**
* | output |
* | --- |
* | "Documents" |
*
* @param {Common_Documents_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_documents_title = /** @type {((inputs?: Common_Documents_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Documents_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_documents_title(inputs)
	return en_common_documents_title(inputs)
});