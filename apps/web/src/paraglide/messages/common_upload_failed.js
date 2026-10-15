/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Upload_FailedInputs */



/**
* | output |
* | --- |
* | "The upload failed. Try again in a moment." |
*
* @param {Common_Upload_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_upload_failed = /** @type {((inputs?: Common_Upload_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Upload_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("L'envoi a échoué. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("The upload failed. Try again in a moment.")
});