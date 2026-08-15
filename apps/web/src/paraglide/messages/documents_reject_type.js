/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Reject_TypeInputs */

const en_documents_reject_type = /** @type {(inputs: Documents_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`unsupported file type`)
};

const fr_documents_reject_type = /** @type {(inputs: Documents_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`type de fichier non pris en charge`)
};

/**
* | output |
* | --- |
* | "unsupported file type" |
*
* @param {Documents_Reject_TypeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_reject_type = /** @type {((inputs?: Documents_Reject_TypeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Reject_TypeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_reject_type(inputs)
	return en_documents_reject_type(inputs)
});