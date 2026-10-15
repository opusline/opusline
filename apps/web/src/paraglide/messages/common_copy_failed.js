/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Copy_FailedInputs */

const en_common_copy_failed = /** @type {(inputs: Common_Copy_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy failed`)
};

const fr_common_copy_failed = /** @type {(inputs: Common_Copy_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échec de la copie`)
};

/**
* | output |
* | --- |
* | "Copy failed" |
*
* @param {Common_Copy_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_copy_failed = /** @type {((inputs?: Common_Copy_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Copy_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_copy_failed(inputs)
	return en_common_copy_failed(inputs)
});