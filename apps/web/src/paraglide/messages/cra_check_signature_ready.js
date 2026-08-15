/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Check_Signature_ReadyInputs */

const en_cra_check_signature_ready = /** @type {(inputs: Cra_Check_Signature_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ready to be applied to the document`)
};

const fr_cra_check_signature_ready = /** @type {(inputs: Cra_Check_Signature_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`prête à être apposée sur le document`)
};

/**
* | output |
* | --- |
* | "ready to be applied to the document" |
*
* @param {Cra_Check_Signature_ReadyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_check_signature_ready = /** @type {((inputs?: Cra_Check_Signature_ReadyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Check_Signature_ReadyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_check_signature_ready(inputs)
	return en_cra_check_signature_ready(inputs)
});