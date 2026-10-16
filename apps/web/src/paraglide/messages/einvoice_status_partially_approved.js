/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_Partially_ApprovedInputs */

const en_einvoice_status_partially_approved = /** @type {(inputs: Einvoice_Status_Partially_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partially approved`)
};

const fr_einvoice_status_partially_approved = /** @type {(inputs: Einvoice_Status_Partially_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approuvée partiellement`)
};

/**
* | output |
* | --- |
* | "Partially approved" |
*
* @param {Einvoice_Status_Partially_ApprovedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_partially_approved = /** @type {((inputs?: Einvoice_Status_Partially_ApprovedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_Partially_ApprovedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_partially_approved(inputs)
	return en_einvoice_status_partially_approved(inputs)
});