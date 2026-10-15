/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_Buffer_SubInputs */

const en_treasury_band_buffer_sub = /** @type {(inputs: Treasury_Band_Buffer_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`set in Settings`)
};

const fr_treasury_band_buffer_sub = /** @type {(inputs: Treasury_Band_Buffer_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`réglable dans Réglages`)
};

/**
* | output |
* | --- |
* | "set in Settings" |
*
* @param {Treasury_Band_Buffer_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_buffer_sub = /** @type {((inputs?: Treasury_Band_Buffer_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_Buffer_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_buffer_sub(inputs)
	return en_treasury_band_buffer_sub(inputs)
});