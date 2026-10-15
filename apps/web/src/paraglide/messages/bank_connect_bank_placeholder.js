/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_Bank_PlaceholderInputs */

const en_bank_connect_bank_placeholder = /** @type {(inputs: Bank_Connect_Bank_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a bank`)
};

const fr_bank_connect_bank_placeholder = /** @type {(inputs: Bank_Connect_Bank_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisir une banque`)
};

/**
* | output |
* | --- |
* | "Choose a bank" |
*
* @param {Bank_Connect_Bank_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_bank_placeholder = /** @type {((inputs?: Bank_Connect_Bank_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_Bank_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_bank_placeholder(inputs)
	return en_bank_connect_bank_placeholder(inputs)
});