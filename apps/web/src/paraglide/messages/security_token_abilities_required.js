/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_Abilities_RequiredInputs */

const en_security_token_abilities_required = /** @type {(inputs: Security_Token_Abilities_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose at least one.`)
};

const fr_security_token_abilities_required = /** @type {(inputs: Security_Token_Abilities_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez-en au moins un.`)
};

/**
* | output |
* | --- |
* | "Choose at least one." |
*
* @param {Security_Token_Abilities_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_abilities_required = /** @type {((inputs?: Security_Token_Abilities_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Abilities_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_abilities_required(inputs)
	return en_security_token_abilities_required(inputs)
});