/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Nav_SettingsInputs */

const en_invoicing_nav_settings = /** @type {(inputs: Invoicing_Nav_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings`)
};

const fr_invoicing_nav_settings = /** @type {(inputs: Invoicing_Nav_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réglages`)
};

/**
* | output |
* | --- |
* | "Settings" |
*
* @param {Invoicing_Nav_SettingsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_nav_settings = /** @type {((inputs?: Invoicing_Nav_SettingsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Nav_SettingsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_nav_settings(inputs)
	return en_invoicing_nav_settings(inputs)
});