/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Provisions_Sub_No_VatInputs */

const en_bank_provisions_sub_no_vat = /** @type {(inputs: Bank_Provisions_Sub_No_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF and buffer`)
};

const fr_bank_provisions_sub_no_vat = /** @type {(inputs: Bank_Provisions_Sub_No_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF et matelas`)
};

/**
* | output |
* | --- |
* | "URSSAF and buffer" |
*
* @param {Bank_Provisions_Sub_No_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_provisions_sub_no_vat = /** @type {((inputs?: Bank_Provisions_Sub_No_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Provisions_Sub_No_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_provisions_sub_no_vat(inputs)
	return en_bank_provisions_sub_no_vat(inputs)
});