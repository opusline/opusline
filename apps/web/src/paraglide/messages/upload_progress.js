/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Upload_ProgressInputs */

const en_upload_progress = /** @type {(inputs: Upload_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sending ${i?.name}`)
};

const fr_upload_progress = /** @type {(inputs: Upload_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Envoi de ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Sending {name}" |
*
* @param {Upload_ProgressInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const upload_progress = /** @type {((inputs: Upload_ProgressInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Upload_ProgressInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_upload_progress(inputs)
	return en_upload_progress(inputs)
});