/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoicing_Error_RejectedInputs */

const en_einvoicing_error_rejected = /** @type {(inputs: Einvoicing_Error_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The platform refused the document.`)
};

const fr_einvoicing_error_rejected = /** @type {(inputs: Einvoicing_Error_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La plateforme a refusé le document.`)
};

/**
* | output |
* | --- |
* | "The platform refused the document." |
*
* @param {Einvoicing_Error_RejectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoicing_error_rejected = /** @type {((inputs?: Einvoicing_Error_RejectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoicing_Error_RejectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoicing_error_rejected(inputs)
	return en_einvoicing_error_rejected(inputs)
});