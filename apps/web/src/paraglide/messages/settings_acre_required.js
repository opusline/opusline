/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Acre_RequiredInputs */

const en_settings_acre_required = /** @type {(inputs: Settings_Acre_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Required to apply the ACRE.`)
};

const fr_settings_acre_required = /** @type {(inputs: Settings_Acre_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Requis pour appliquer l'ACRE.`)
};

/**
* | output |
* | --- |
* | "Required to apply the ACRE." |
*
* @param {Settings_Acre_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_acre_required = /** @type {((inputs?: Settings_Acre_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Acre_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_acre_required(inputs)
	return en_settings_acre_required(inputs)
});