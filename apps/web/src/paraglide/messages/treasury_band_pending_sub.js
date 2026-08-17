/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_Pending_SubInputs */

const en_treasury_band_pending_sub = /** @type {(inputs: Treasury_Band_Pending_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`noted, not yet on a statement`)
};

const fr_treasury_band_pending_sub = /** @type {(inputs: Treasury_Band_Pending_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`noté, pas encore sur un relevé`)
};

/**
* | output |
* | --- |
* | "noted, not yet on a statement" |
*
* @param {Treasury_Band_Pending_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_pending_sub = /** @type {((inputs?: Treasury_Band_Pending_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_Pending_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_pending_sub(inputs)
	return en_treasury_band_pending_sub(inputs)
});