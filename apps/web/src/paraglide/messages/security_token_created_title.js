/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_Created_TitleInputs */

const en_security_token_created_title = /** @type {(inputs: Security_Token_Created_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your new token`)
};

const fr_security_token_created_title = /** @type {(inputs: Security_Token_Created_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre nouveau jeton`)
};

/**
* | output |
* | --- |
* | "Your new token" |
*
* @param {Security_Token_Created_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_created_title = /** @type {((inputs?: Security_Token_Created_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Created_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_created_title(inputs)
	return en_security_token_created_title(inputs)
});