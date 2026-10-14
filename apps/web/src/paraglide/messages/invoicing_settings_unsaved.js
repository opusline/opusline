/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Settings_UnsavedInputs */

const en_invoicing_settings_unsaved = /** @type {(inputs: Invoicing_Settings_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unsaved changes`)
};

const fr_invoicing_settings_unsaved = /** @type {(inputs: Invoicing_Settings_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifications non enregistrées`)
};

/**
* | output |
* | --- |
* | "Unsaved changes" |
*
* @param {Invoicing_Settings_UnsavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_settings_unsaved = /** @type {((inputs?: Invoicing_Settings_UnsavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Settings_UnsavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_settings_unsaved(inputs)
	return en_invoicing_settings_unsaved(inputs)
});