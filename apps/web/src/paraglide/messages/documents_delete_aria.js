/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Documents_Delete_AriaInputs */

const en_documents_delete_aria = /** @type {(inputs: Documents_Delete_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Delete ${i?.name}`)
};

const fr_documents_delete_aria = /** @type {(inputs: Documents_Delete_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Supprimer ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Delete {name}" |
*
* @param {Documents_Delete_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_delete_aria = /** @type {((inputs: Documents_Delete_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Delete_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_delete_aria(inputs)
	return en_documents_delete_aria(inputs)
});