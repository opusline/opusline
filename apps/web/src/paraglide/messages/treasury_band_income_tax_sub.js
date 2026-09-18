/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown>, years: NonNullable<unknown> }} Treasury_Band_Income_Tax_SubInputs */

const en_treasury_band_income_tax_sub = /** @type {(inputs: Treasury_Band_Income_Tax_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`withholding rate ${i?.rate} · income ${i?.years}`)
};

const fr_treasury_band_income_tax_sub = /** @type {(inputs: Treasury_Band_Income_Tax_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`taux de prélèvement ${i?.rate} · revenus ${i?.years}`)
};

/**
* | output |
* | --- |
* | "withholding rate {rate} · income {years}" |
*
* @param {Treasury_Band_Income_Tax_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_income_tax_sub = /** @type {((inputs: Treasury_Band_Income_Tax_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_Income_Tax_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_income_tax_sub(inputs)
	return en_treasury_band_income_tax_sub(inputs)
});