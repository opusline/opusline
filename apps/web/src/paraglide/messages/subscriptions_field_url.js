/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Field_UrlInputs */

const en_subscriptions_field_url = /** @type {(inputs: Subscriptions_Field_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer space URL`)
};

const fr_subscriptions_field_url = /** @type {(inputs: Subscriptions_Field_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URL de l'espace client`)
};

/**
* | output |
* | --- |
* | "Customer space URL" |
*
* @param {Subscriptions_Field_UrlInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_field_url = /** @type {((inputs?: Subscriptions_Field_UrlInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Field_UrlInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_field_url(inputs)
	return en_subscriptions_field_url(inputs)
});