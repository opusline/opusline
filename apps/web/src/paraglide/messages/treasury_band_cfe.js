/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_CfeInputs */

const en_treasury_band_cfe = /** @type {(inputs: Treasury_Band_CfeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE to set aside`)
};

const fr_treasury_band_cfe = /** @type {(inputs: Treasury_Band_CfeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE à provisionner`)
};

/**
* | output |
* | --- |
* | "CFE to set aside" |
*
* @param {Treasury_Band_CfeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_cfe = /** @type {((inputs?: Treasury_Band_CfeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_CfeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_cfe(inputs)
	return en_treasury_band_cfe(inputs)
});