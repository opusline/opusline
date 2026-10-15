/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Upload_FailedInputs */

const en_common_upload_failed = /** @type {(inputs: Common_Upload_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The upload failed. Try again in a moment.`)
};

const fr_common_upload_failed = /** @type {(inputs: Common_Upload_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'envoi a échoué. Réessayez dans un instant.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_upload_failed(inputs)
	return en_common_upload_failed(inputs)
});