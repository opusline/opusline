/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Mode_HourlyInputs */

const en_missions_billing_mode_hourly = /** @type {(inputs: Missions_Billing_Mode_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Per hour`)
};

const fr_missions_billing_mode_hourly = /** @type {(inputs: Missions_Billing_Mode_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À l'heure`)
};

/**
* | output |
* | --- |
* | "Per hour" |
*
* @param {Missions_Billing_Mode_HourlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_mode_hourly = /** @type {((inputs?: Missions_Billing_Mode_HourlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Mode_HourlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billing_mode_hourly(inputs)
	return en_missions_billing_mode_hourly(inputs)
});