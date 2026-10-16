/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Settings_SavedInputs */

const en_invoicing_settings_saved = /** @type {(inputs: Invoicing_Settings_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoicing settings saved`)
};

const fr_invoicing_settings_saved = /** @type {(inputs: Invoicing_Settings_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réglages de facturation enregistrés`)
};

/**
* | output |
* | --- |
* | "Invoicing settings saved" |
*
* @param {Invoicing_Settings_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_settings_saved = /** @type {((inputs?: Invoicing_Settings_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Settings_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_settings_saved(inputs)
	return en_invoicing_settings_saved(inputs)
});