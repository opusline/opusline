/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Auto_Create_Help_1Inputs */

const en_subscriptions_auto_create_help_1 = /** @type {(inputs: Subscriptions_Auto_Create_Help_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`When the option is on, Opusline creates the expense on the debit day, with the HT amount, the TVA regime and the pro share set here. It shows in the month's journal as « Bloquée · facture manquante » until you link the receipt — the TVA only reaches the CA3 then.`)
};

const fr_subscriptions_auto_create_help_1 = /** @type {(inputs: Subscriptions_Auto_Create_Help_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quand l'option est activée, Opusline crée la dépense le jour du prélèvement, avec le montant HT, le régime de TVA et la quote-part pro définis ici. Elle apparaît dans le journal du mois avec le statut « Bloquée · facture manquante » jusqu'à ce que vous liiez la facture — la TVA n'est déduite sur la CA3 qu'à ce moment-là.`)
};

/**
* | output |
* | --- |
* | "When the option is on, Opusline creates the expense on the debit day, with the HT amount, the TVA regime and the pro share set here. It shows in the month's ..." |
*
* @param {Subscriptions_Auto_Create_Help_1Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_auto_create_help_1 = /** @type {((inputs?: Subscriptions_Auto_Create_Help_1Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Auto_Create_Help_1Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_auto_create_help_1(inputs)
	return en_subscriptions_auto_create_help_1(inputs)
});