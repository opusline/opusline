/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Documents_Remove_AriaInputs */

const en_documents_remove_aria = /** @type {(inputs: Documents_Remove_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Remove ${i?.name}`)
};

const fr_documents_remove_aria = /** @type {(inputs: Documents_Remove_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Retirer ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Remove {name}" |
*
* @param {Documents_Remove_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_remove_aria = /** @type {((inputs: Documents_Remove_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Remove_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_remove_aria(inputs)
	return en_documents_remove_aria(inputs)
});