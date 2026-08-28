/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Treasury_Band_Cfe_SubInputs */

const en_treasury_band_cfe_sub = /** @type {(inputs: Treasury_Band_Cfe_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`built up monthly · CFE ${i?.year}`)
};

const fr_treasury_band_cfe_sub = /** @type {(inputs: Treasury_Band_Cfe_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`constituée mois par mois · CFE ${i?.year}`)
};

/**
* | output |
* | --- |
* | "built up monthly · CFE {year}" |
*
* @param {Treasury_Band_Cfe_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_cfe_sub = /** @type {((inputs: Treasury_Band_Cfe_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_Cfe_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_cfe_sub(inputs)
	return en_treasury_band_cfe_sub(inputs)
});