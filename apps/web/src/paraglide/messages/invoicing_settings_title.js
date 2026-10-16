/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Settings_TitleInputs */

const en_invoicing_settings_title = /** @type {(inputs: Invoicing_Settings_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoicing settings`)
};

const fr_invoicing_settings_title = /** @type {(inputs: Invoicing_Settings_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réglages de facturation`)
};

/**
* | output |
* | --- |
* | "Invoicing settings" |
*
* @param {Invoicing_Settings_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_settings_title = /** @type {((inputs?: Invoicing_Settings_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Settings_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_settings_title(inputs)
	return en_invoicing_settings_title(inputs)
});