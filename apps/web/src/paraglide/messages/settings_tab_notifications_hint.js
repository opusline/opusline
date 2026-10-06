/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Notifications_HintInputs */

const en_settings_tab_notifications_hint = /** @type {(inputs: Settings_Tab_Notifications_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alerts, reminders`)
};

const fr_settings_tab_notifications_hint = /** @type {(inputs: Settings_Tab_Notifications_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alertes, rappels`)
};

/**
* | output |
* | --- |
* | "Alerts, reminders" |
*
* @param {Settings_Tab_Notifications_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_notifications_hint = /** @type {((inputs?: Settings_Tab_Notifications_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Notifications_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_notifications_hint(inputs)
	return en_settings_tab_notifications_hint(inputs)
});