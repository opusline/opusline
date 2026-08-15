/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Urssaf_Periodicity_LabelInputs */

const en_settings_urssaf_periodicity_label = /** @type {(inputs: Settings_Urssaf_Periodicity_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF periodicity`)
};

const fr_settings_urssaf_periodicity_label = /** @type {(inputs: Settings_Urssaf_Periodicity_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Périodicité URSSAF`)
};

/**
* | output |
* | --- |
* | "URSSAF periodicity" |
*
* @param {Settings_Urssaf_Periodicity_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_urssaf_periodicity_label = /** @type {((inputs?: Settings_Urssaf_Periodicity_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Urssaf_Periodicity_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_urssaf_periodicity_label(inputs)
	return en_settings_urssaf_periodicity_label(inputs)
});