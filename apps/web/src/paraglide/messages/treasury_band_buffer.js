/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_BufferInputs */

const en_treasury_band_buffer = /** @type {(inputs: Treasury_Band_BufferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Treasury buffer`)
};

const fr_treasury_band_buffer = /** @type {(inputs: Treasury_Band_BufferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matelas de trésorerie`)
};

/**
* | output |
* | --- |
* | "Treasury buffer" |
*
* @param {Treasury_Band_BufferInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_buffer = /** @type {((inputs?: Treasury_Band_BufferInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_BufferInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_buffer(inputs)
	return en_treasury_band_buffer(inputs)
});