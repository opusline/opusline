/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_CreateInputs */

const en_security_token_create = /** @type {(inputs: Security_Token_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create`)
};

const fr_security_token_create = /** @type {(inputs: Security_Token_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer`)
};

/**
* | output |
* | --- |
* | "Create" |
*
* @param {Security_Token_CreateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_create = /** @type {((inputs?: Security_Token_CreateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_CreateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_create(inputs)
	return en_security_token_create(inputs)
});