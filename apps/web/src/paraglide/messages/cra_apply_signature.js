/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Apply_SignatureInputs */

const en_cra_apply_signature = /** @type {(inputs: Cra_Apply_SignatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apply my signature`)
};

const fr_cra_apply_signature = /** @type {(inputs: Cra_Apply_SignatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apposer ma signature`)
};

/**
* | output |
* | --- |
* | "Apply my signature" |
*
* @param {Cra_Apply_SignatureInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_apply_signature = /** @type {((inputs?: Cra_Apply_SignatureInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Apply_SignatureInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_apply_signature(inputs)
	return en_cra_apply_signature(inputs)
});