/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Auto_EntrepreneurInputs */

const en_settings_auto_entrepreneur = /** @type {(inputs: Settings_Auto_EntrepreneurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Auto-entrepreneur`)
};

const fr_settings_auto_entrepreneur = /** @type {(inputs: Settings_Auto_EntrepreneurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Auto-entrepreneur`)
};

/**
* | output |
* | --- |
* | "Auto-entrepreneur" |
*
* @param {Settings_Auto_EntrepreneurInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_auto_entrepreneur = /** @type {((inputs?: Settings_Auto_EntrepreneurInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Auto_EntrepreneurInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_auto_entrepreneur(inputs)
	return en_settings_auto_entrepreneur(inputs)
});