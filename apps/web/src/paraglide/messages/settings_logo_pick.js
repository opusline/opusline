/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Logo_PickInputs */

const en_settings_logo_pick = /** @type {(inputs: Settings_Logo_PickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a logo`)
};

const fr_settings_logo_pick = /** @type {(inputs: Settings_Logo_PickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter un logo`)
};

/**
* | output |
* | --- |
* | "Add a logo" |
*
* @param {Settings_Logo_PickInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_logo_pick = /** @type {((inputs?: Settings_Logo_PickInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Logo_PickInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_logo_pick(inputs)
	return en_settings_logo_pick(inputs)
});