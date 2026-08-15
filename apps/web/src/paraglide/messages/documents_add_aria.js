/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Add_AriaInputs */

const en_documents_add_aria = /** @type {(inputs: Documents_Add_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add documents`)
};

const fr_documents_add_aria = /** @type {(inputs: Documents_Add_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter des documents`)
};

/**
* | output |
* | --- |
* | "Add documents" |
*
* @param {Documents_Add_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_add_aria = /** @type {((inputs?: Documents_Add_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Add_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_add_aria(inputs)
	return en_documents_add_aria(inputs)
});