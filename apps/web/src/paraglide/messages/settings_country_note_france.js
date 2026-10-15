/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Country_Note_FranceInputs */

const en_settings_country_note_france = /** @type {(inputs: Settings_Country_Note_FranceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`France is the only country whose tax rules are implemented: the auto-entrepreneur regime, SIRET, URSSAF contributions and French VAT.`)
};

const fr_settings_country_note_france = /** @type {(inputs: Settings_Country_Note_FranceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La France est le seul pays dont les règles fiscales sont implémentées : régime auto-entrepreneur, SIRET, cotisations URSSAF et TVA française.`)
};

/**
* | output |
* | --- |
* | "France is the only country whose tax rules are implemented: the auto-entrepreneur regime, SIRET, URSSAF contributions and French VAT." |
*
* @param {Settings_Country_Note_FranceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_country_note_france = /** @type {((inputs?: Settings_Country_Note_FranceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Country_Note_FranceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_country_note_france(inputs)
	return en_settings_country_note_france(inputs)
});