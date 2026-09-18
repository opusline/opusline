/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_TitleInputs */

const en_bank_connection_title = /** @type {(inputs: Bank_Connection_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank sync`)
};

const fr_bank_connection_title = /** @type {(inputs: Bank_Connection_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Synchronisation bancaire`)
};

/**
* | output |
* | --- |
* | "Bank sync" |
*
* @param {Bank_Connection_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_title = /** @type {((inputs?: Bank_Connection_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_title(inputs)
	return en_bank_connection_title(inputs)
});