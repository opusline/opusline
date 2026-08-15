/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Fiscality_LabelInputs */

const en_settings_tab_fiscality_label = /** @type {(inputs: Settings_Tab_Fiscality_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tax`)
};

const fr_settings_tab_fiscality_label = /** @type {(inputs: Settings_Tab_Fiscality_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fiscalité`)
};

/**
* | output |
* | --- |
* | "Tax" |
*
* @param {Settings_Tab_Fiscality_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_fiscality_label = /** @type {((inputs?: Settings_Tab_Fiscality_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Fiscality_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_fiscality_label(inputs)
	return en_settings_tab_fiscality_label(inputs)
});