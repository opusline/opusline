/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_Psu_BusinessInputs */

const en_bank_connect_psu_business = /** @type {(inputs: Bank_Connect_Psu_BusinessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business`)
};

const fr_bank_connect_psu_business = /** @type {(inputs: Bank_Connect_Psu_BusinessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Professionnel`)
};

/**
* | output |
* | --- |
* | "Business" |
*
* @param {Bank_Connect_Psu_BusinessInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_psu_business = /** @type {((inputs?: Bank_Connect_Psu_BusinessInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_Psu_BusinessInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_psu_business(inputs)
	return en_bank_connect_psu_business(inputs)
});