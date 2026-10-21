/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_AddInputs */

const en_bank_connection_add = /** @type {(inputs: Bank_Connection_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connect another bank`)
};

const fr_bank_connection_add = /** @type {(inputs: Bank_Connection_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connecter une autre banque`)
};

/**
* | output |
* | --- |
* | "Connect another bank" |
*
* @param {Bank_Connection_AddInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_add = /** @type {((inputs?: Bank_Connection_AddInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_AddInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_add(inputs)
	return en_bank_connection_add(inputs)
});