/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_EmptyInputs */

const en_security_token_empty = /** @type {(inputs: Security_Token_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No token yet.`)
};

const fr_security_token_empty = /** @type {(inputs: Security_Token_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun jeton pour le moment.`)
};

/**
* | output |
* | --- |
* | "No token yet." |
*
* @param {Security_Token_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_empty = /** @type {((inputs?: Security_Token_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_empty(inputs)
	return en_security_token_empty(inputs)
});