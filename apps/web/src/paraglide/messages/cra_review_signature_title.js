/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Review_Signature_TitleInputs */

const en_cra_review_signature_title = /** @type {(inputs: Cra_Review_Signature_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signature`)
};

const fr_cra_review_signature_title = /** @type {(inputs: Cra_Review_Signature_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signature`)
};

/**
* | output |
* | --- |
* | "Signature" |
*
* @param {Cra_Review_Signature_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_review_signature_title = /** @type {((inputs?: Cra_Review_Signature_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Review_Signature_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_review_signature_title(inputs)
	return en_cra_review_signature_title(inputs)
});