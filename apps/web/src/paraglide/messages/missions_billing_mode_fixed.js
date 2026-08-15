/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Mode_FixedInputs */

const en_missions_billing_mode_fixed = /** @type {(inputs: Missions_Billing_Mode_FixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed price`)
};

const fr_missions_billing_mode_fixed = /** @type {(inputs: Missions_Billing_Mode_FixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Forfait`)
};

/**
* | output |
* | --- |
* | "Fixed price" |
*
* @param {Missions_Billing_Mode_FixedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_mode_fixed = /** @type {((inputs?: Missions_Billing_Mode_FixedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Mode_FixedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billing_mode_fixed(inputs)
	return en_missions_billing_mode_fixed(inputs)
});