/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Error_UploadInputs */

const en_cra_error_upload = /** @type {(inputs: Cra_Error_UploadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The signed return could not be saved.`)
};

const fr_cra_error_upload = /** @type {(inputs: Cra_Error_UploadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le retour signé n'a pas pu être enregistré.`)
};

/**
* | output |
* | --- |
* | "The signed return could not be saved." |
*
* @param {Cra_Error_UploadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_error_upload = /** @type {((inputs?: Cra_Error_UploadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Error_UploadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_error_upload(inputs)
	return en_cra_error_upload(inputs)
});