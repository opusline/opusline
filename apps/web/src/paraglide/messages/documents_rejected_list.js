/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ files: NonNullable<unknown> }} Documents_Rejected_ListInputs */

const en_documents_rejected_list = /** @type {(inputs: Documents_Rejected_ListInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ignored files: ${i?.files}.`)
};

const fr_documents_rejected_list = /** @type {(inputs: Documents_Rejected_ListInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fichiers ignorés : ${i?.files}.`)
};

/**
* | output |
* | --- |
* | "Ignored files: {files}." |
*
* @param {Documents_Rejected_ListInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_rejected_list = /** @type {((inputs: Documents_Rejected_ListInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Rejected_ListInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_rejected_list(inputs)
	return en_documents_rejected_list(inputs)
});