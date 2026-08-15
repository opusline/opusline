/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Tab_ConfigurationInputs */

const en_missions_tab_configuration = /** @type {(inputs: Missions_Tab_ConfigurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configuration`)
};

const fr_missions_tab_configuration = /** @type {(inputs: Missions_Tab_ConfigurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configuration`)
};

/**
* | output |
* | --- |
* | "Configuration" |
*
* @param {Missions_Tab_ConfigurationInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_tab_configuration = /** @type {((inputs?: Missions_Tab_ConfigurationInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Tab_ConfigurationInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_tab_configuration(inputs)
	return en_missions_tab_configuration(inputs)
});