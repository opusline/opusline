/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoicing_Error_UnavailableInputs */

const en_einvoicing_error_unavailable = /** @type {(inputs: Einvoicing_Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The e-invoicing platform could not be reached. Try again later.`)
};

const fr_einvoicing_error_unavailable = /** @type {(inputs: Einvoicing_Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La plateforme de facturation électronique est injoignable. Réessayez plus tard.`)
};

/**
* | output |
* | --- |
* | "The e-invoicing platform could not be reached. Try again later." |
*
* @param {Einvoicing_Error_UnavailableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoicing_error_unavailable = /** @type {((inputs?: Einvoicing_Error_UnavailableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoicing_Error_UnavailableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoicing_error_unavailable(inputs)
	return en_einvoicing_error_unavailable(inputs)
});