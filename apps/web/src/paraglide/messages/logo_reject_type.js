/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Logo_Reject_TypeInputs */

const en_logo_reject_type = /** @type {(inputs: Logo_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG or SVG only`)
};

const fr_logo_reject_type = /** @type {(inputs: Logo_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG ou SVG uniquement`)
};

/**
* | output |
* | --- |
* | "PNG or SVG only" |
*
* @param {Logo_Reject_TypeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const logo_reject_type = /** @type {((inputs?: Logo_Reject_TypeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Logo_Reject_TypeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_logo_reject_type(inputs)
	return en_logo_reject_type(inputs)
});