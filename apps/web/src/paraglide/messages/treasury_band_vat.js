/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_VatInputs */

const en_treasury_band_vat = /** @type {(inputs: Treasury_Band_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT to set aside`)
};

const fr_treasury_band_vat = /** @type {(inputs: Treasury_Band_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA à provisionner`)
};

/**
* | output |
* | --- |
* | "VAT to set aside" |
*
* @param {Treasury_Band_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_vat = /** @type {((inputs?: Treasury_Band_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_vat(inputs)
	return en_treasury_band_vat(inputs)
});