/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ list: NonNullable<unknown> }} My_Documents_Missing_BodyInputs */

const en_my_documents_missing_body = /** @type {(inputs: My_Documents_Missing_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Missing: ${i?.list}.`)
};

const fr_my_documents_missing_body = /** @type {(inputs: My_Documents_Missing_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Manquant : ${i?.list}.`)
};

/**
* | output |
* | --- |
* | "Missing: {list}." |
*
* @param {My_Documents_Missing_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_missing_body = /** @type {((inputs: My_Documents_Missing_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_Missing_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_missing_body(inputs)
	return en_my_documents_missing_body(inputs)
});