/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoicing_Error_Not_FoundInputs */

const en_einvoicing_error_not_found = /** @type {(inputs: Einvoicing_Error_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The platform has no invoice under that reference.`)
};

const fr_einvoicing_error_not_found = /** @type {(inputs: Einvoicing_Error_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La plateforme ne connaît aucune facture sous cette référence.`)
};

/**
* | output |
* | --- |
* | "The platform has no invoice under that reference." |
*
* @param {Einvoicing_Error_Not_FoundInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoicing_error_not_found = /** @type {((inputs?: Einvoicing_Error_Not_FoundInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoicing_Error_Not_FoundInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoicing_error_not_found(inputs)
	return en_einvoicing_error_not_found(inputs)
});