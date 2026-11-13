/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_Ability_Treasury_ReadInputs */

const en_security_token_ability_treasury_read = /** @type {(inputs: Security_Token_Ability_Treasury_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reads the treasury`)
};

const fr_security_token_ability_treasury_read = /** @type {(inputs: Security_Token_Ability_Treasury_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lecture de la trésorerie`)
};

/**
* | output |
* | --- |
* | "Reads the treasury" |
*
* @param {Security_Token_Ability_Treasury_ReadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_ability_treasury_read = /** @type {((inputs?: Security_Token_Ability_Treasury_ReadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Ability_Treasury_ReadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_ability_treasury_read(inputs)
	return en_security_token_ability_treasury_read(inputs)
});