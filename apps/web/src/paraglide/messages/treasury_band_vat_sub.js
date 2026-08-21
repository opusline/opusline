/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Treasury_Band_Vat_SubInputs */

const en_treasury_band_vat_sub = /** @type {(inputs: Treasury_Band_Vat_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`period to ${i?.date}`)
};

const fr_treasury_band_vat_sub = /** @type {(inputs: Treasury_Band_Vat_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`période jusqu'au ${i?.date}`)
};

/**
* | output |
* | --- |
* | "period to {date}" |
*
* @param {Treasury_Band_Vat_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_vat_sub = /** @type {((inputs: Treasury_Band_Vat_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_Vat_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_vat_sub(inputs)
	return en_treasury_band_vat_sub(inputs)
});