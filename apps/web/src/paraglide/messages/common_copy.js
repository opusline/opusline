/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_CopyInputs */

const en_common_copy = /** @type {(inputs: Common_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy`)
};

const fr_common_copy = /** @type {(inputs: Common_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copier`)
};

/**
* | output |
* | --- |
* | "Copy" |
*
* @param {Common_CopyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_copy = /** @type {((inputs?: Common_CopyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_CopyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_copy(inputs)
	return en_common_copy(inputs)
});