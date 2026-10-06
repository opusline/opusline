/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notifications_Security_Alerts_LabelInputs */

const en_notifications_security_alerts_label = /** @type {(inputs: Notifications_Security_Alerts_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Security alerts`)
};

const fr_notifications_security_alerts_label = /** @type {(inputs: Notifications_Security_Alerts_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alertes de sécurité`)
};

/**
* | output |
* | --- |
* | "Security alerts" |
*
* @param {Notifications_Security_Alerts_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const notifications_security_alerts_label = /** @type {((inputs?: Notifications_Security_Alerts_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notifications_Security_Alerts_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notifications_security_alerts_label(inputs)
	return en_notifications_security_alerts_label(inputs)
});