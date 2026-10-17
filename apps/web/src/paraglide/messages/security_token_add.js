/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_AddInputs */

const en_security_token_add = /** @type {(inputs: Security_Token_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a token`)
};

const fr_security_token_add = /** @type {(inputs: Security_Token_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer un jeton`)
};

/**
* | output |
* | --- |
* | "Create a token" |
*
* @param {Security_Token_AddInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_add = /** @type {((inputs?: Security_Token_AddInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_AddInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_add(inputs)
	return en_security_token_add(inputs)
});