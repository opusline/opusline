/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connect_SubmitInputs */

const en_bank_connect_submit = /** @type {(inputs: Bank_Connect_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Continue to the bank`)
};

const fr_bank_connect_submit = /** @type {(inputs: Bank_Connect_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Continuer vers la banque`)
};

/**
* | output |
* | --- |
* | "Continue to the bank" |
*
* @param {Bank_Connect_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connect_submit = /** @type {((inputs?: Bank_Connect_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connect_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connect_submit(inputs)
	return en_bank_connect_submit(inputs)
});