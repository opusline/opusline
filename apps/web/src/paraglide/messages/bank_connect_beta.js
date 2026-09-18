/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_BetaInputs */

const en_bank_connect_beta = /** @type {(inputs: Bank_Connect_BetaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable Banking flags its connection to this bank as beta.`)
};

const fr_bank_connect_beta = /** @type {(inputs: Bank_Connect_BetaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable Banking signale sa connexion à cette banque comme expérimentale.`)
};

/**
* | output |
* | --- |
* | "Enable Banking flags its connection to this bank as beta." |
*
* @param {Bank_Connect_BetaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_beta = /** @type {((inputs?: Bank_Connect_BetaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_BetaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_beta(inputs)
	return en_bank_connect_beta(inputs)
});