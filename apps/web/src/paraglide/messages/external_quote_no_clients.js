/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_No_ClientsInputs */

const en_external_quote_no_clients = /** @type {(inputs: External_Quote_No_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a client first: a quote is always filed under one.`)
};

const fr_external_quote_no_clients = /** @type {(inputs: External_Quote_No_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez d'abord un client : un devis est toujours rangé sous l'un d'eux.`)
};

/**
* | output |
* | --- |
* | "Create a client first: a quote is always filed under one." |
*
* @param {External_Quote_No_ClientsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_no_clients = /** @type {((inputs?: External_Quote_No_ClientsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_No_ClientsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_no_clients(inputs)
	return en_external_quote_no_clients(inputs)
});