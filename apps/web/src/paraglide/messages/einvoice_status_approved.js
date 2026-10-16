/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_ApprovedInputs */

const en_einvoice_status_approved = /** @type {(inputs: Einvoice_Status_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved`)
};

const fr_einvoice_status_approved = /** @type {(inputs: Einvoice_Status_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approuvée`)
};

/**
* | output |
* | --- |
* | "Approved" |
*
* @param {Einvoice_Status_ApprovedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_approved = /** @type {((inputs?: Einvoice_Status_ApprovedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_ApprovedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_approved(inputs)
	return en_einvoice_status_approved(inputs)
});