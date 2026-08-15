/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ size: NonNullable<unknown>, date: NonNullable<unknown> }} Documents_Added_OnInputs */

const en_documents_added_on = /** @type {(inputs: Documents_Added_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.size} · added on ${i?.date}`)
};

const fr_documents_added_on = /** @type {(inputs: Documents_Added_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.size} · ajouté le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "{size} · added on {date}" |
*
* @param {Documents_Added_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_added_on = /** @type {((inputs: Documents_Added_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Added_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_added_on(inputs)
	return en_documents_added_on(inputs)
});