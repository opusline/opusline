/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_UrssafInputs */

const en_treasury_band_urssaf = /** @type {(inputs: Treasury_Band_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF provision`)
};

const fr_treasury_band_urssaf = /** @type {(inputs: Treasury_Band_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provision URSSAF`)
};

/**
* | output |
* | --- |
* | "URSSAF provision" |
*
* @param {Treasury_Band_UrssafInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_urssaf = /** @type {((inputs?: Treasury_Band_UrssafInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_UrssafInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_urssaf(inputs)
	return en_treasury_band_urssaf(inputs)
});