/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Check_Signature_OnInputs */

const en_cra_check_signature_on = /** @type {(inputs: Cra_Check_Signature_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved`)
};

const fr_cra_check_signature_on = /** @type {(inputs: Cra_Check_Signature_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrée`)
};

/**
* | output |
* | --- |
* | "Saved" |
*
* @param {Cra_Check_Signature_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_check_signature_on = /** @type {((inputs?: Cra_Check_Signature_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Check_Signature_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_check_signature_on(inputs)
	return en_cra_check_signature_on(inputs)
});