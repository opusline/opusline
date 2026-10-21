/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Unpair_FailedInputs */

const en_bank_unpair_failed = /** @type {(inputs: Bank_Unpair_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The transfer could not be undone.`)
};

const fr_bank_unpair_failed = /** @type {(inputs: Bank_Unpair_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le virement interne n'a pas pu être annulé.`)
};

/**
* | output |
* | --- |
* | "The transfer could not be undone." |
*
* @param {Bank_Unpair_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_unpair_failed = /** @type {((inputs?: Bank_Unpair_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Unpair_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_unpair_failed(inputs)
	return en_bank_unpair_failed(inputs)
});