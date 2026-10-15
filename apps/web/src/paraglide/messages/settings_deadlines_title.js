/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Deadlines_TitleInputs */

const en_settings_deadlines_title = /** @type {(inputs: Settings_Deadlines_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deadlines`)
};

const fr_settings_deadlines_title = /** @type {(inputs: Settings_Deadlines_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échéances`)
};

/**
* | output |
* | --- |
* | "Deadlines" |
*
* @param {Settings_Deadlines_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_deadlines_title = /** @type {((inputs?: Settings_Deadlines_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Deadlines_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_deadlines_title(inputs)
	return en_settings_deadlines_title(inputs)
});