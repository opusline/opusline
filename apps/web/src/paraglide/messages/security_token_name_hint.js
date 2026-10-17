/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_Name_HintInputs */

const en_security_token_name_hint = /** @type {(inputs: Security_Token_Name_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The application it is for, so you recognise it later.`)
};

const fr_security_token_name_hint = /** @type {(inputs: Security_Token_Name_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'application à laquelle il est destiné, pour le reconnaître plus tard.`)
};

/**
* | output |
* | --- |
* | "The application it is for, so you recognise it later." |
*
* @param {Security_Token_Name_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_name_hint = /** @type {((inputs?: Security_Token_Name_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Name_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_name_hint(inputs)
	return en_security_token_name_hint(inputs)
});