/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ value: NonNullable<unknown> }} Common_MegabytesInputs */

const en_common_megabytes = /** @type {(inputs: Common_MegabytesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} MB`)
};

const fr_common_megabytes = /** @type {(inputs: Common_MegabytesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} Mo`)
};

/**
* | output |
* | --- |
* | "{value} MB" |
*
* @param {Common_MegabytesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_megabytes = /** @type {((inputs: Common_MegabytesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_MegabytesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_megabytes(inputs)
	return en_common_megabytes(inputs)
});