/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Documents_Name_AriaInputs */

const en_documents_name_aria = /** @type {(inputs: Documents_Name_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Name of document ${i?.name}`)
};

const fr_documents_name_aria = /** @type {(inputs: Documents_Name_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nom du document ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Name of document {name}" |
*
* @param {Documents_Name_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_name_aria = /** @type {((inputs: Documents_Name_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Name_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_name_aria(inputs)
	return en_documents_name_aria(inputs)
});