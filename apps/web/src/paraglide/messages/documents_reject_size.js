/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Reject_SizeInputs */

const en_documents_reject_size = /** @type {(inputs: Documents_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`too heavy (max 20 MB)`)
};

const fr_documents_reject_size = /** @type {(inputs: Documents_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`trop lourd (max 20 Mo)`)
};

/**
* | output |
* | --- |
* | "too heavy (max 20 MB)" |
*
* @param {Documents_Reject_SizeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_reject_size = /** @type {((inputs?: Documents_Reject_SizeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Reject_SizeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_reject_size(inputs)
	return en_documents_reject_size(inputs)
});