/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Save_SignatureInputs */

const en_cra_save_signature = /** @type {(inputs: Cra_Save_SignatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save my signature`)
};

const fr_cra_save_signature = /** @type {(inputs: Cra_Save_SignatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer ma signature`)
};

/**
* | output |
* | --- |
* | "Save my signature" |
*
* @param {Cra_Save_SignatureInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_save_signature = /** @type {((inputs?: Cra_Save_SignatureInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Save_SignatureInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_save_signature(inputs)
	return en_cra_save_signature(inputs)
});