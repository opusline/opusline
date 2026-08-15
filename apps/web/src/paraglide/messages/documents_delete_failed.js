/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Delete_FailedInputs */

const en_documents_delete_failed = /** @type {(inputs: Documents_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The deletion failed. Try again in a moment.`)
};

const fr_documents_delete_failed = /** @type {(inputs: Documents_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La suppression a échoué. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The deletion failed. Try again in a moment." |
*
* @param {Documents_Delete_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_delete_failed = /** @type {((inputs?: Documents_Delete_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Delete_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_delete_failed(inputs)
	return en_documents_delete_failed(inputs)
});