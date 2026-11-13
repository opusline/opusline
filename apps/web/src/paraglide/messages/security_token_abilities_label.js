/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_Abilities_LabelInputs */

const en_security_token_abilities_label = /** @type {(inputs: Security_Token_Abilities_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What it may read`)
};

const fr_security_token_abilities_label = /** @type {(inputs: Security_Token_Abilities_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce qu'il peut lire`)
};

/**
* | output |
* | --- |
* | "What it may read" |
*
* @param {Security_Token_Abilities_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_abilities_label = /** @type {((inputs?: Security_Token_Abilities_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Abilities_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_abilities_label(inputs)
	return en_security_token_abilities_label(inputs)
});