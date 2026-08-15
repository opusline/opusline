/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Documents_Type_AriaInputs */

const en_documents_type_aria = /** @type {(inputs: Documents_Type_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Type of ${i?.name}`)
};

const fr_documents_type_aria = /** @type {(inputs: Documents_Type_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Type de ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Type of {name}" |
*
* @param {Documents_Type_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_type_aria = /** @type {((inputs: Documents_Type_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Type_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_type_aria(inputs)
	return en_documents_type_aria(inputs)
});