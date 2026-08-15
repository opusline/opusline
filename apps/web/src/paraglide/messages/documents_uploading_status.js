/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ size: NonNullable<unknown> }} Documents_Uploading_StatusInputs */

const en_documents_uploading_status = /** @type {(inputs: Documents_Uploading_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.size} · uploading…`)
};

const fr_documents_uploading_status = /** @type {(inputs: Documents_Uploading_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.size} · envoi en cours…`)
};

/**
* | output |
* | --- |
* | "{size} · uploading…" |
*
* @param {Documents_Uploading_StatusInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_uploading_status = /** @type {((inputs: Documents_Uploading_StatusInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Uploading_StatusInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_uploading_status(inputs)
	return en_documents_uploading_status(inputs)
});