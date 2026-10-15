/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Mode_DailyInputs */

const en_missions_billing_mode_daily = /** @type {(inputs: Missions_Billing_Mode_DailyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Per day (TJM)`)
};

const fr_missions_billing_mode_daily = /** @type {(inputs: Missions_Billing_Mode_DailyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Au jour (TJM)`)
};

/**
* | output |
* | --- |
* | "Per day (TJM)" |
*
* @param {Missions_Billing_Mode_DailyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_mode_daily = /** @type {((inputs?: Missions_Billing_Mode_DailyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Mode_DailyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billing_mode_daily(inputs)
	return en_missions_billing_mode_daily(inputs)
});