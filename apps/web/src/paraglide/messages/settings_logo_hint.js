/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Logo_HintInputs */

const en_settings_logo_hint = /** @type {(inputs: Settings_Logo_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG, JPG or SVG · 1.5 MB max · printed on your documents and e-mails`)
};

const fr_settings_logo_hint = /** @type {(inputs: Settings_Logo_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG, JPG ou SVG · 1,5 Mo maximum · repris sur les documents et les e-mails`)
};

/**
* | output |
* | --- |
* | "PNG, JPG or SVG · 1.5 MB max · printed on your documents and e-mails" |
*
* @param {Settings_Logo_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_logo_hint = /** @type {((inputs?: Settings_Logo_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Logo_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_logo_hint(inputs)
	return en_settings_logo_hint(inputs)
});