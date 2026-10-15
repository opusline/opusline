/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Identity_DescriptionInputs */

const en_settings_identity_description = /** @type {(inputs: Settings_Identity_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Make up the header of your CRAs and invoices.`)
};

const fr_settings_identity_description = /** @type {(inputs: Settings_Identity_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Composent l'en-tête de vos CRA et de vos factures.`)
};

/**
* | output |
* | --- |
* | "Make up the header of your CRAs and invoices." |
*
* @param {Settings_Identity_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_identity_description = /** @type {((inputs?: Settings_Identity_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Identity_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_identity_description(inputs)
	return en_settings_identity_description(inputs)
});