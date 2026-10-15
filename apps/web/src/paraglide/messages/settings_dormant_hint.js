/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Dormant_HintInputs */

const en_settings_dormant_hint = /** @type {(inputs: Settings_Dormant_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing is deleted: a finished mission goes back to active in a click, and an archived client is unarchived in one. Runs overnight.`)
};

const fr_settings_dormant_hint = /** @type {(inputs: Settings_Dormant_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien n'est supprimé : une mission terminée redevient active en un clic, et un client archivé se désarchive de même. S'exécute la nuit.`)
};

/**
* | output |
* | --- |
* | "Nothing is deleted: a finished mission goes back to active in a click, and an archived client is unarchived in one. Runs overnight." |
*
* @param {Settings_Dormant_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_dormant_hint = /** @type {((inputs?: Settings_Dormant_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Dormant_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_dormant_hint(inputs)
	return en_settings_dormant_hint(inputs)
});