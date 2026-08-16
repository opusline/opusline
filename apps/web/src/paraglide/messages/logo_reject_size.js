/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Logo_Reject_SizeInputs */

const en_logo_reject_size = /** @type {(inputs: Logo_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`too heavy (max 2 MB)`)
};

const fr_logo_reject_size = /** @type {(inputs: Logo_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`trop lourd (max 2 Mo)`)
};

/**
* | output |
* | --- |
* | "too heavy (max 2 MB)" |
*
* @param {Logo_Reject_SizeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const logo_reject_size = /** @type {((inputs?: Logo_Reject_SizeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Logo_Reject_SizeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_logo_reject_size(inputs)
	return en_logo_reject_size(inputs)
});