/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ value: NonNullable<unknown> }} Common_KilobytesInputs */

const en_common_kilobytes = /** @type {(inputs: Common_KilobytesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} kB`)
};

const fr_common_kilobytes = /** @type {(inputs: Common_KilobytesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} Ko`)
};

/**
* | output |
* | --- |
* | "{value} kB" |
*
* @param {Common_KilobytesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_kilobytes = /** @type {((inputs: Common_KilobytesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_KilobytesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_kilobytes(inputs)
	return en_common_kilobytes(inputs)
});