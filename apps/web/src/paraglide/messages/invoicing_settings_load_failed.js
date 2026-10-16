/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Settings_Load_FailedInputs */

const en_invoicing_settings_load_failed = /** @type {(inputs: Invoicing_Settings_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoicing settings could not be loaded.`)
};

const fr_invoicing_settings_load_failed = /** @type {(inputs: Invoicing_Settings_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les réglages de facturation n'ont pas pu être chargés.`)
};

/**
* | output |
* | --- |
* | "The invoicing settings could not be loaded." |
*
* @param {Invoicing_Settings_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_settings_load_failed = /** @type {((inputs?: Invoicing_Settings_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Settings_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_settings_load_failed(inputs)
	return en_invoicing_settings_load_failed(inputs)
});