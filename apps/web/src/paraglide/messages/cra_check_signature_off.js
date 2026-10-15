/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Check_Signature_OffInputs */

const en_cra_check_signature_off = /** @type {(inputs: Cra_Check_Signature_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Missing`)
};

const fr_cra_check_signature_off = /** @type {(inputs: Cra_Check_Signature_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Absente`)
};

/**
* | output |
* | --- |
* | "Missing" |
*
* @param {Cra_Check_Signature_OffInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_check_signature_off = /** @type {((inputs?: Cra_Check_Signature_OffInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Check_Signature_OffInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_check_signature_off(inputs)
	return en_cra_check_signature_off(inputs)
});