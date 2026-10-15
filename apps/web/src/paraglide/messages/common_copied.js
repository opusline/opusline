/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_CopiedInputs */

const en_common_copied = /** @type {(inputs: Common_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copied`)
};

const fr_common_copied = /** @type {(inputs: Common_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copié`)
};

/**
* | output |
* | --- |
* | "Copied" |
*
* @param {Common_CopiedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_copied = /** @type {((inputs?: Common_CopiedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_CopiedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_copied(inputs)
	return en_common_copied(inputs)
});