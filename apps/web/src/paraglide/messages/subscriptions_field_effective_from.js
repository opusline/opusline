/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Field_Effective_FromInputs */

const en_subscriptions_field_effective_from = /** @type {(inputs: Subscriptions_Field_Effective_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From`)
};

const fr_subscriptions_field_effective_from = /** @type {(inputs: Subscriptions_Field_Effective_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À partir du`)
};

/**
* | output |
* | --- |
* | "From" |
*
* @param {Subscriptions_Field_Effective_FromInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_field_effective_from = /** @type {((inputs?: Subscriptions_Field_Effective_FromInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Field_Effective_FromInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_field_effective_from(inputs)
	return en_subscriptions_field_effective_from(inputs)
});