/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_Taken_In_ChargeInputs */

const en_einvoice_status_taken_in_charge = /** @type {(inputs: Einvoice_Status_Taken_In_ChargeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acknowledged`)
};

const fr_einvoice_status_taken_in_charge = /** @type {(inputs: Einvoice_Status_Taken_In_ChargeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prise en charge`)
};

/**
* | output |
* | --- |
* | "Acknowledged" |
*
* @param {Einvoice_Status_Taken_In_ChargeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_taken_in_charge = /** @type {((inputs?: Einvoice_Status_Taken_In_ChargeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_Taken_In_ChargeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_taken_in_charge(inputs)
	return en_einvoice_status_taken_in_charge(inputs)
});