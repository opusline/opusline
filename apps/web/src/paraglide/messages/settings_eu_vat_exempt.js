/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Eu_Vat_ExemptInputs */

const en_settings_eu_vat_exempt = /** @type {(inputs: Settings_Eu_Vat_ExemptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not VAT-liable · franchise en base`)
};

const fr_settings_eu_vat_exempt = /** @type {(inputs: Settings_Eu_Vat_ExemptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non assujetti · franchise en base`)
};

/**
* | output |
* | --- |
* | "Not VAT-liable · franchise en base" |
*
* @param {Settings_Eu_Vat_ExemptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_eu_vat_exempt = /** @type {((inputs?: Settings_Eu_Vat_ExemptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Eu_Vat_ExemptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_eu_vat_exempt(inputs)
	return en_settings_eu_vat_exempt(inputs)
});