/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_PendingInputs */

const en_treasury_band_pending = /** @type {(inputs: Treasury_Band_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Already transferred`)
};

const fr_treasury_band_pending = /** @type {(inputs: Treasury_Band_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déjà viré`)
};

/**
* | output |
* | --- |
* | "Already transferred" |
*
* @param {Treasury_Band_PendingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_pending = /** @type {((inputs?: Treasury_Band_PendingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_PendingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_pending(inputs)
	return en_treasury_band_pending(inputs)
});