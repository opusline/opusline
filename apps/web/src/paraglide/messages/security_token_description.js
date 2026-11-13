/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_DescriptionInputs */

const en_security_token_description = /** @type {(inputs: Security_Token_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Let another application read your invoices, missions, treasury or declarations with a personal access token, sent as a bearer. A token only reads what you tick; revoke it here to cut the access.`)
};

const fr_security_token_description = /** @type {(inputs: Security_Token_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Laissez une autre application lire vos factures, missions, trésorerie ou déclarations avec un jeton d'accès personnel, envoyé en bearer. Un jeton ne lit que ce que vous cochez ; révoquez-le ici pour couper l'accès.`)
};

/**
* | output |
* | --- |
* | "Let another application read your invoices, missions, treasury or declarations with a personal access token, sent as a bearer. A token only reads what you ti..." |
*
* @param {Security_Token_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_description = /** @type {((inputs?: Security_Token_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_description(inputs)
	return en_security_token_description(inputs)
});