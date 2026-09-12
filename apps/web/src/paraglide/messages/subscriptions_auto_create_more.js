/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Auto_Create_MoreInputs */

const en_subscriptions_auto_create_more = /** @type {(inputs: Subscriptions_Auto_Create_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Learn more`)
};

const fr_subscriptions_auto_create_more = /** @type {(inputs: Subscriptions_Auto_Create_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En savoir plus`)
};

/**
* | output |
* | --- |
* | "Learn more" |
*
* @param {Subscriptions_Auto_Create_MoreInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_auto_create_more = /** @type {((inputs?: Subscriptions_Auto_Create_MoreInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Auto_Create_MoreInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_auto_create_more(inputs)
	return en_subscriptions_auto_create_more(inputs)
});