/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Mode_LabelInputs */

const en_missions_billing_mode_label = /** @type {(inputs: Missions_Billing_Mode_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billing mode`)
};

const fr_missions_billing_mode_label = /** @type {(inputs: Missions_Billing_Mode_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mode de facturation`)
};

/**
* | output |
* | --- |
* | "Billing mode" |
*
* @param {Missions_Billing_Mode_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_mode_label = /** @type {((inputs?: Missions_Billing_Mode_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Mode_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billing_mode_label(inputs)
	return en_missions_billing_mode_label(inputs)
});