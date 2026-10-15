/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Company_Address_HintInputs */

const en_settings_company_address_hint = /** @type {(inputs: Settings_Company_Address_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shown on documents`)
};

const fr_settings_company_address_hint = /** @type {(inputs: Settings_Company_Address_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Figure sur les documents`)
};

/**
* | output |
* | --- |
* | "Shown on documents" |
*
* @param {Settings_Company_Address_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_company_address_hint = /** @type {((inputs?: Settings_Company_Address_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Company_Address_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_company_address_hint(inputs)
	return en_settings_company_address_hint(inputs)
});