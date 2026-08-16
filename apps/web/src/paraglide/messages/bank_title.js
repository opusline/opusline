/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_TitleInputs */

const en_bank_title = /** @type {(inputs: Bank_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business account`)
};

const fr_bank_title = /** @type {(inputs: Bank_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compte pro`)
};

/**
* | output |
* | --- |
* | "Business account" |
*
* @param {Bank_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_title = /** @type {((inputs?: Bank_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_title(inputs)
	return en_bank_title(inputs)
});