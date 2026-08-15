/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Fiscality_Abroad_DescriptionInputs */

const en_settings_fiscality_abroad_description = /** @type {(inputs: Settings_Fiscality_Abroad_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF contributions, the franchise en base and the versement libératoire are specific to the French regime. The chosen country's rules are not implemented yet: provisions and filings must be computed outside the app.`)
};

const fr_settings_fiscality_abroad_description = /** @type {(inputs: Settings_Fiscality_Abroad_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les cotisations URSSAF, la franchise en base et le versement libératoire sont propres au régime français. Les règles du pays choisi ne sont pas encore implémentées : provisions et déclarations sont à calculer hors de l'application.`)
};

/**
* | output |
* | --- |
* | "URSSAF contributions, the franchise en base and the versement libératoire are specific to the French regime. The chosen country's rules are not implemented y..." |
*
* @param {Settings_Fiscality_Abroad_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_fiscality_abroad_description = /** @type {((inputs?: Settings_Fiscality_Abroad_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Fiscality_Abroad_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_fiscality_abroad_description(inputs)
	return en_settings_fiscality_abroad_description(inputs)
});