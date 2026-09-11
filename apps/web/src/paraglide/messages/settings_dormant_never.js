/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Dormant_NeverInputs */

const en_settings_dormant_never = /** @type {(inputs: Settings_Dormant_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Never — I tidy up myself`)
};

const fr_settings_dormant_never = /** @type {(inputs: Settings_Dormant_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jamais — je range moi-même`)
};

/**
* | output |
* | --- |
* | "Never — I tidy up myself" |
*
* @param {Settings_Dormant_NeverInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_dormant_never = /** @type {((inputs?: Settings_Dormant_NeverInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Dormant_NeverInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_dormant_never(inputs)
	return en_settings_dormant_never(inputs)
});