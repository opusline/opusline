/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown>, date: NonNullable<unknown> }} Treasury_Band_Urssaf_SubInputs */

const en_treasury_band_urssaf_sub = /** @type {(inputs: Treasury_Band_Urssaf_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.rate} · period to ${i?.date}`)
};

const fr_treasury_band_urssaf_sub = /** @type {(inputs: Treasury_Band_Urssaf_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.rate} · période jusqu'au ${i?.date}`)
};

/**
* | output |
* | --- |
* | "{rate} · period to {date}" |
*
* @param {Treasury_Band_Urssaf_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_urssaf_sub = /** @type {((inputs: Treasury_Band_Urssaf_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_Urssaf_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_urssaf_sub(inputs)
	return en_treasury_band_urssaf_sub(inputs)
});