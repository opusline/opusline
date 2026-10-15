/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Save_FailedInputs */

const en_common_save_failed = /** @type {(inputs: Common_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saving failed. Try again in a moment.`)
};

const fr_common_save_failed = /** @type {(inputs: Common_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'enregistrement a échoué. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "Saving failed. Try again in a moment." |
*
* @param {Common_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_save_failed = /** @type {((inputs?: Common_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_save_failed(inputs)
	return en_common_save_failed(inputs)
});