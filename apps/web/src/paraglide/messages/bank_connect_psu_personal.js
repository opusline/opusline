/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_Psu_PersonalInputs */

const en_bank_connect_psu_personal = /** @type {(inputs: Bank_Connect_Psu_PersonalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Personal`)
};

const fr_bank_connect_psu_personal = /** @type {(inputs: Bank_Connect_Psu_PersonalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Personnel`)
};

/**
* | output |
* | --- |
* | "Personal" |
*
* @param {Bank_Connect_Psu_PersonalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_psu_personal = /** @type {((inputs?: Bank_Connect_Psu_PersonalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_Psu_PersonalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_psu_personal(inputs)
	return en_bank_connect_psu_personal(inputs)
});