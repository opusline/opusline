/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_DescriptionInputs */

const en_bank_connect_description = /** @type {(inputs: Bank_Connect_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You will be sent to your bank to let Opusline read your movements through Enable Banking.`)
};

const fr_bank_connect_description = /** @type {(inputs: Bank_Connect_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vous allez être redirigé vers votre banque pour autoriser Opusline, via Enable Banking, à lire vos mouvements.`)
};

/**
* | output |
* | --- |
* | "You will be sent to your bank to let Opusline read your movements through Enable Banking." |
*
* @param {Bank_Connect_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_description = /** @type {((inputs?: Bank_Connect_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_description(inputs)
	return en_bank_connect_description(inputs)
});