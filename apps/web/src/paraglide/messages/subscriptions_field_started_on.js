/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Field_Started_OnInputs */

const en_subscriptions_field_started_on = /** @type {(inputs: Subscriptions_Field_Started_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start date`)
};

const fr_subscriptions_field_started_on = /** @type {(inputs: Subscriptions_Field_Started_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date de début`)
};

/**
* | output |
* | --- |
* | "Start date" |
*
* @param {Subscriptions_Field_Started_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_field_started_on = /** @type {((inputs?: Subscriptions_Field_Started_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Field_Started_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_field_started_on(inputs)
	return en_subscriptions_field_started_on(inputs)
});