/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_SubtitleInputs */

const en_treasury_subtitle = /** @type {(inputs: Treasury_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Computed on the pro account balance, tax provisions deducted.`)
};

const fr_treasury_subtitle = /** @type {(inputs: Treasury_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calculé sur le solde du compte pro, provisions fiscales déduites.`)
};

/**
* | output |
* | --- |
* | "Computed on the pro account balance, tax provisions deducted." |
*
* @param {Treasury_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_subtitle = /** @type {((inputs?: Treasury_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_subtitle(inputs)
	return en_treasury_subtitle(inputs)
});