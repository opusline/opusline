/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_IntroInputs */

const en_treasury_intro = /** @type {(inputs: Treasury_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Worked out from the business account balance, tax provisions deducted.`)
};

const fr_treasury_intro = /** @type {(inputs: Treasury_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calculé sur le solde du compte pro, provisions fiscales déduites.`)
};

/**
* | output |
* | --- |
* | "Worked out from the business account balance, tax provisions deducted." |
*
* @param {Treasury_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_intro = /** @type {((inputs?: Treasury_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_intro(inputs)
	return en_treasury_intro(inputs)
});