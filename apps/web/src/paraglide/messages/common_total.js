/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_TotalInputs */

const en_common_total = /** @type {(inputs: Common_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total`)
};

const fr_common_total = /** @type {(inputs: Common_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total`)
};

/**
* | output |
* | --- |
* | "Total" |
*
* @param {Common_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_total = /** @type {((inputs?: Common_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_total(inputs)
	return en_common_total(inputs)
});