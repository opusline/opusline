/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Mention_Outside_EuInputs */

const en_vat_mention_outside_eu = /** @type {(inputs: Vat_Mention_Outside_EuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA non applicable — prestation hors champ, art. 259-1 du CGI`)
};

const fr_vat_mention_outside_eu = /** @type {(inputs: Vat_Mention_Outside_EuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA non applicable — prestation hors champ, art. 259-1 du CGI`)
};

/**
* | output |
* | --- |
* | "TVA non applicable — prestation hors champ, art. 259-1 du CGI" |
*
* @param {Vat_Mention_Outside_EuInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_mention_outside_eu = /** @type {((inputs?: Vat_Mention_Outside_EuInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Mention_Outside_EuInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_mention_outside_eu(inputs)
	return en_vat_mention_outside_eu(inputs)
});