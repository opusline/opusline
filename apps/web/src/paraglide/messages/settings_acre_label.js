/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Acre_LabelInputs */

const en_settings_acre_label = /** @type {(inputs: Settings_Acre_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I benefit from the ACRE — the rate is reduced for the first four quarters.`)
};

const fr_settings_acre_label = /** @type {(inputs: Settings_Acre_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Je bénéficie de l'ACRE — le taux est réduit pendant les quatre premiers trimestres.`)
};

/**
* | output |
* | --- |
* | "I benefit from the ACRE — the rate is reduced for the first four quarters." |
*
* @param {Settings_Acre_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_acre_label = /** @type {((inputs?: Settings_Acre_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Acre_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_acre_label(inputs)
	return en_settings_acre_label(inputs)
});