/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Check_Signature_MissingInputs */

const en_cra_check_signature_missing = /** @type {(inputs: Cra_Check_Signature_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no signature saved in your settings`)
};

const fr_cra_check_signature_missing = /** @type {(inputs: Cra_Check_Signature_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucune signature enregistrée dans vos réglages`)
};

/**
* | output |
* | --- |
* | "no signature saved in your settings" |
*
* @param {Cra_Check_Signature_MissingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_check_signature_missing = /** @type {((inputs?: Cra_Check_Signature_MissingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Check_Signature_MissingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_check_signature_missing(inputs)
	return en_cra_check_signature_missing(inputs)
});