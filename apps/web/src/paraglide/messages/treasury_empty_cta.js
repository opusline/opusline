/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Empty_CtaInputs */

const en_treasury_empty_cta = /** @type {(inputs: Treasury_Empty_CtaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Go to Business account`)
};

const fr_treasury_empty_cta = /** @type {(inputs: Treasury_Empty_CtaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aller au compte pro`)
};

/**
* | output |
* | --- |
* | "Go to Business account" |
*
* @param {Treasury_Empty_CtaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_empty_cta = /** @type {((inputs?: Treasury_Empty_CtaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Empty_CtaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_empty_cta(inputs)
	return en_treasury_empty_cta(inputs)
});