/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Documents_Toggle_GroupInputs */

const en_documents_toggle_group = /** @type {(inputs: Documents_Toggle_GroupInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Show or hide the documents of ${i?.name}`)
};

const fr_documents_toggle_group = /** @type {(inputs: Documents_Toggle_GroupInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Afficher ou masquer les documents de ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Show or hide the documents of {name}" |
*
* @param {Documents_Toggle_GroupInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_toggle_group = /** @type {((inputs: Documents_Toggle_GroupInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Toggle_GroupInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_toggle_group(inputs)
	return en_documents_toggle_group(inputs)
});