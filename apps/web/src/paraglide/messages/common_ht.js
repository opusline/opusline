/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_HtInputs */

const en_common_ht = /** @type {(inputs: Common_HtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`HT`)
};

const fr_common_ht = /** @type {(inputs: Common_HtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`HT`)
};

/**
* | output |
* | --- |
* | "HT" |
*
* @param {Common_HtInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_ht = /** @type {((inputs?: Common_HtInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_HtInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_ht(inputs)
	return en_common_ht(inputs)
});