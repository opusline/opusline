/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_Psu_LabelInputs */

const en_bank_connect_psu_label = /** @type {(inputs: Bank_Connect_Psu_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account type`)
};

const fr_bank_connect_psu_label = /** @type {(inputs: Bank_Connect_Psu_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type de compte`)
};

/**
* | output |
* | --- |
* | "Account type" |
*
* @param {Bank_Connect_Psu_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_psu_label = /** @type {((inputs?: Bank_Connect_Psu_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_Psu_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_psu_label(inputs)
	return en_bank_connect_psu_label(inputs)
});