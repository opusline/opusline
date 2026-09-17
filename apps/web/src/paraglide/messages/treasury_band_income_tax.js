/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_Income_TaxInputs */

const en_treasury_band_income_tax = /** @type {(inputs: Treasury_Band_Income_TaxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Income tax to set aside`)
};

const fr_treasury_band_income_tax = /** @type {(inputs: Treasury_Band_Income_TaxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impôt sur le revenu à provisionner`)
};

/**
* | output |
* | --- |
* | "Income tax to set aside" |
*
* @param {Treasury_Band_Income_TaxInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_income_tax = /** @type {((inputs?: Treasury_Band_Income_TaxInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_Income_TaxInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_income_tax(inputs)
	return en_treasury_band_income_tax(inputs)
});