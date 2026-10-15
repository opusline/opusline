/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Vat_Rate_FranchiseInputs */

const en_clients_vat_rate_franchise = /** @type {(inputs: Clients_Vat_Rate_FranchiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No VAT · franchise en base`)
};

const fr_clients_vat_rate_franchise = /** @type {(inputs: Clients_Vat_Rate_FranchiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas de TVA · franchise en base`)
};

/**
* | output |
* | --- |
* | "No VAT · franchise en base" |
*
* @param {Clients_Vat_Rate_FranchiseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_vat_rate_franchise = /** @type {((inputs?: Clients_Vat_Rate_FranchiseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Vat_Rate_FranchiseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_vat_rate_franchise(inputs)
	return en_clients_vat_rate_franchise(inputs)
});