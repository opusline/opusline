/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_FailedInputs */

const en_bank_connect_failed = /** @type {(inputs: Bank_Connect_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The bank connection could not start.`)
};

const fr_bank_connect_failed = /** @type {(inputs: Bank_Connect_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La connexion à la banque n'a pas pu démarrer.`)
};

/**
* | output |
* | --- |
* | "The bank connection could not start." |
*
* @param {Bank_Connect_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_failed = /** @type {((inputs?: Bank_Connect_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_failed(inputs)
	return en_bank_connect_failed(inputs)
});