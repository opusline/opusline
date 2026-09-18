/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_Banks_FailedInputs */

const en_bank_connect_banks_failed = /** @type {(inputs: Bank_Connect_Banks_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The list of banks could not be loaded.`)
};

const fr_bank_connect_banks_failed = /** @type {(inputs: Bank_Connect_Banks_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La liste des banques n'a pas pu être chargée.`)
};

/**
* | output |
* | --- |
* | "The list of banks could not be loaded." |
*
* @param {Bank_Connect_Banks_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_banks_failed = /** @type {((inputs?: Bank_Connect_Banks_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_Banks_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_banks_failed(inputs)
	return en_bank_connect_banks_failed(inputs)
});