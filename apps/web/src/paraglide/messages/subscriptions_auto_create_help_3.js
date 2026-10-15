/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Auto_Create_Help_3Inputs */

const en_subscriptions_auto_create_help_3 = /** @type {(inputs: Subscriptions_Auto_Create_Help_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn the option off when the amount changes every month (electricity, usage-based billing): add the expense yourself with the real amount, and keep the subscription for tracking only.`)
};

const fr_subscriptions_auto_create_help_3 = /** @type {(inputs: Subscriptions_Auto_Create_Help_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Désactivez l'option si le montant varie chaque mois (consommation électrique, facturation à l'usage) : vous ajouterez la dépense vous-même avec le montant réel, et l'abonnement servira uniquement au suivi.`)
};

/**
* | output |
* | --- |
* | "Turn the option off when the amount changes every month (electricity, usage-based billing): add the expense yourself with the real amount, and keep the subsc..." |
*
* @param {Subscriptions_Auto_Create_Help_3Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_auto_create_help_3 = /** @type {((inputs?: Subscriptions_Auto_Create_Help_3Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Auto_Create_Help_3Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_auto_create_help_3(inputs)
	return en_subscriptions_auto_create_help_3(inputs)
});