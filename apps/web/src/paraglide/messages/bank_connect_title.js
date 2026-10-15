/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_TitleInputs */

const en_bank_connect_title = /** @type {(inputs: Bank_Connect_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connect my bank`)
};

const fr_bank_connect_title = /** @type {(inputs: Bank_Connect_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connecter ma banque`)
};

/**
* | output |
* | --- |
* | "Connect my bank" |
*
* @param {Bank_Connect_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_title = /** @type {((inputs?: Bank_Connect_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_title(inputs)
	return en_bank_connect_title(inputs)
});