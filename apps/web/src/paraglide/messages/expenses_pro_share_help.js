/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Pro_Share_HelpInputs */

const en_expenses_pro_share_help = /** @type {(inputs: Expenses_Pro_Share_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The share of the purchase used for the business. Only that share of the TVA is recovered, and only that share counts as a charge.`)
};

const fr_expenses_pro_share_help = /** @type {(inputs: Expenses_Pro_Share_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Part de la dépense utilisée pour l'activité. Seule cette part de la TVA est récupérée, et seule cette part compte dans vos charges.`)
};

/**
* | output |
* | --- |
* | "The share of the purchase used for the business. Only that share of the TVA is recovered, and only that share counts as a charge." |
*
* @param {Expenses_Pro_Share_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_pro_share_help = /** @type {((inputs?: Expenses_Pro_Share_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Pro_Share_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_pro_share_help(inputs)
	return en_expenses_pro_share_help(inputs)
});