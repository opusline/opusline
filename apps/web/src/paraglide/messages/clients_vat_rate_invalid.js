/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Vat_Rate_InvalidInputs */

const en_clients_vat_rate_invalid = /** @type {(inputs: Clients_Vat_Rate_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a rate between 0 and 100, or leave it empty.`)
};

const fr_clients_vat_rate_invalid = /** @type {(inputs: Clients_Vat_Rate_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un taux entre 0 et 100, ou laissez vide.`)
};

/**
* | output |
* | --- |
* | "Enter a rate between 0 and 100, or leave it empty." |
*
* @param {Clients_Vat_Rate_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_vat_rate_invalid = /** @type {((inputs?: Clients_Vat_Rate_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Vat_Rate_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_vat_rate_invalid(inputs)
	return en_clients_vat_rate_invalid(inputs)
});