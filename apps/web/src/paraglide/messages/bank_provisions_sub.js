/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Provisions_SubInputs */

const en_bank_provisions_sub = /** @type {(inputs: Bank_Provisions_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT, URSSAF and buffer`)
};

const fr_bank_provisions_sub = /** @type {(inputs: Bank_Provisions_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA, URSSAF et matelas`)
};

/**
* | output |
* | --- |
* | "VAT, URSSAF and buffer" |
*
* @param {Bank_Provisions_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_provisions_sub = /** @type {((inputs?: Bank_Provisions_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Provisions_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_provisions_sub(inputs)
	return en_bank_provisions_sub(inputs)
});