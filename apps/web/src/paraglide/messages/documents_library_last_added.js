/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Documents_Library_Last_AddedInputs */

const en_documents_library_last_added = /** @type {(inputs: Documents_Library_Last_AddedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`last filed on ${i?.date}`)
};

const fr_documents_library_last_added = /** @type {(inputs: Documents_Library_Last_AddedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`dernier dépôt le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "last filed on {date}" |
*
* @param {Documents_Library_Last_AddedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_library_last_added = /** @type {((inputs: Documents_Library_Last_AddedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Library_Last_AddedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_library_last_added(inputs)
	return en_documents_library_last_added(inputs)
});