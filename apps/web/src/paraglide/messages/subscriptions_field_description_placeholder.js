/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Field_Description_PlaceholderInputs */

const en_subscriptions_field_description_placeholder = /** @type {(inputs: Subscriptions_Field_Description_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business fibre, VPS + domain…`)
};

const fr_subscriptions_field_description_placeholder = /** @type {(inputs: Subscriptions_Field_Description_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fibre pro, VPS + domaine…`)
};

/**
* | output |
* | --- |
* | "Business fibre, VPS + domain…" |
*
* @param {Subscriptions_Field_Description_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_field_description_placeholder = /** @type {((inputs?: Subscriptions_Field_Description_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Field_Description_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_field_description_placeholder(inputs)
	return en_subscriptions_field_description_placeholder(inputs)
});