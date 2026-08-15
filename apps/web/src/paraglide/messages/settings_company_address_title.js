/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Company_Address_TitleInputs */

const en_settings_company_address_title = /** @type {(inputs: Settings_Company_Address_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Company address`)
};

const fr_settings_company_address_title = /** @type {(inputs: Settings_Company_Address_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse de la société`)
};

/**
* | output |
* | --- |
* | "Company address" |
*
* @param {Settings_Company_Address_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_company_address_title = /** @type {((inputs?: Settings_Company_Address_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Company_Address_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_company_address_title(inputs)
	return en_settings_company_address_title(inputs)
});