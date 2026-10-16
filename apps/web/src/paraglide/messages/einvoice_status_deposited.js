/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_DepositedInputs */

const en_einvoice_status_deposited = /** @type {(inputs: Einvoice_Status_DepositedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deposited`)
};

const fr_einvoice_status_deposited = /** @type {(inputs: Einvoice_Status_DepositedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déposée`)
};

/**
* | output |
* | --- |
* | "Deposited" |
*
* @param {Einvoice_Status_DepositedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_deposited = /** @type {((inputs?: Einvoice_Status_DepositedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_DepositedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_deposited(inputs)
	return en_einvoice_status_deposited(inputs)
});