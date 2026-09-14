/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Auto_Create_Help_2Inputs */

const en_subscriptions_auto_create_help_2 = /** @type {(inputs: Subscriptions_Auto_Create_Help_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`If the debit is found on the compte pro, it is matched to that expense automatically: no duplicate.`)
};

const fr_subscriptions_auto_create_help_2 = /** @type {(inputs: Subscriptions_Auto_Create_Help_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Si le prélèvement est détecté sur le compte pro, il est rapproché automatiquement de cette dépense : pas de doublon.`)
};

/**
* | output |
* | --- |
* | "If the debit is found on the compte pro, it is matched to that expense automatically: no duplicate." |
*
* @param {Subscriptions_Auto_Create_Help_2Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_auto_create_help_2 = /** @type {((inputs?: Subscriptions_Auto_Create_Help_2Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Auto_Create_Help_2Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_auto_create_help_2(inputs)
	return en_subscriptions_auto_create_help_2(inputs)
});