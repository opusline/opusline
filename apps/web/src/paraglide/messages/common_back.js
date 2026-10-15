/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_BackInputs */

const en_common_back = /** @type {(inputs: Common_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back`)
};

const fr_common_back = /** @type {(inputs: Common_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour`)
};

/**
* | output |
* | --- |
* | "Back" |
*
* @param {Common_BackInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_back = /** @type {((inputs?: Common_BackInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_BackInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_back(inputs)
	return en_common_back(inputs)
});