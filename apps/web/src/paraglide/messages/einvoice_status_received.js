/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_ReceivedInputs */

const en_einvoice_status_received = /** @type {(inputs: Einvoice_Status_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Received`)
};

const fr_einvoice_status_received = /** @type {(inputs: Einvoice_Status_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reçue`)
};

/**
* | output |
* | --- |
* | "Received" |
*
* @param {Einvoice_Status_ReceivedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_received = /** @type {((inputs?: Einvoice_Status_ReceivedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_ReceivedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_received(inputs)
	return en_einvoice_status_received(inputs)
});