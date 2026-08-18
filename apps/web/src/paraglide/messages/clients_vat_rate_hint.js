/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Clients_Vat_Rate_HintInputs */

const en_clients_vat_rate_hint = /** @type {(inputs: Clients_Vat_Rate_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Leave empty to follow your ${i?.rate} % rate. Set 0 for a client you charge no VAT.`)
};

const fr_clients_vat_rate_hint = /** @type {(inputs: Clients_Vat_Rate_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Laissez vide pour suivre votre taux de ${i?.rate} %. Mettez 0 pour un client que vous ne facturez pas en TVA.`)
};

/**
* | output |
* | --- |
* | "Leave empty to follow your {rate} % rate. Set 0 for a client you charge no VAT." |
*
* @param {Clients_Vat_Rate_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_vat_rate_hint = /** @type {((inputs: Clients_Vat_Rate_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Vat_Rate_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_vat_rate_hint(inputs)
	return en_clients_vat_rate_hint(inputs)
});