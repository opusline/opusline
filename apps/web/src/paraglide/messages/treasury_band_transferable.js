/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_TransferableInputs */

const en_treasury_band_transferable = /** @type {(inputs: Treasury_Band_TransferableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transferable`)
};

const fr_treasury_band_transferable = /** @type {(inputs: Treasury_Band_TransferableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Virable`)
};

/**
* | output |
* | --- |
* | "Transferable" |
*
* @param {Treasury_Band_TransferableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_transferable = /** @type {((inputs?: Treasury_Band_TransferableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_TransferableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_transferable(inputs)
	return en_treasury_band_transferable(inputs)
});