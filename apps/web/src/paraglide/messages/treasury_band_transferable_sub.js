/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_Transferable_SubInputs */

const en_treasury_band_transferable_sub = /** @type {(inputs: Treasury_Band_Transferable_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`to your personal account`)
};

const fr_treasury_band_transferable_sub = /** @type {(inputs: Treasury_Band_Transferable_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`vers compte perso`)
};

/**
* | output |
* | --- |
* | "to your personal account" |
*
* @param {Treasury_Band_Transferable_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_transferable_sub = /** @type {((inputs?: Treasury_Band_Transferable_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_Transferable_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_transferable_sub(inputs)
	return en_treasury_band_transferable_sub(inputs)
});