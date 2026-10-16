/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_RejectedInputs */

const en_einvoice_status_rejected = /** @type {(inputs: Einvoice_Status_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected by the platform`)
};

const fr_einvoice_status_rejected = /** @type {(inputs: Einvoice_Status_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejetée par la plateforme`)
};

/**
* | output |
* | --- |
* | "Rejected by the platform" |
*
* @param {Einvoice_Status_RejectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_rejected = /** @type {((inputs?: Einvoice_Status_RejectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_RejectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_rejected(inputs)
	return en_einvoice_status_rejected(inputs)
});