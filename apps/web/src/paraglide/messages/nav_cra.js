/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_CraInputs */

const en_nav_cra = /** @type {(inputs: Nav_CraInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CRA`)
};

const fr_nav_cra = /** @type {(inputs: Nav_CraInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CRA`)
};

/**
* | output |
* | --- |
* | "CRA" |
*
* @param {Nav_CraInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_cra = /** @type {((inputs?: Nav_CraInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_CraInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_cra(inputs)
	return en_nav_cra(inputs)
});