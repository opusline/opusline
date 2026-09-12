/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Auto_CreateInputs */

const en_subscriptions_auto_create = /** @type {(inputs: Subscriptions_Auto_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the expense automatically`)
};

const fr_subscriptions_auto_create = /** @type {(inputs: Subscriptions_Auto_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer automatiquement la dépense`)
};

/**
* | output |
* | --- |
* | "Create the expense automatically" |
*
* @param {Subscriptions_Auto_CreateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_auto_create = /** @type {((inputs?: Subscriptions_Auto_CreateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Auto_CreateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_auto_create(inputs)
	return en_subscriptions_auto_create(inputs)
});