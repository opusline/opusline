/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_CollectedInputs */

const en_einvoice_status_collected = /** @type {(inputs: Einvoice_Status_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paid`)
};

const fr_einvoice_status_collected = /** @type {(inputs: Einvoice_Status_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Encaissée`)
};

/**
* | output |
* | --- |
* | "Paid" |
*
* @param {Einvoice_Status_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_collected = /** @type {((inputs?: Einvoice_Status_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_collected(inputs)
	return en_einvoice_status_collected(inputs)
});