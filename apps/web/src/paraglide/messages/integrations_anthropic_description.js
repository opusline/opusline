/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Anthropic_DescriptionInputs */

const en_integrations_anthropic_description = /** @type {(inputs: Integrations_Anthropic_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`With your own Anthropic API key, Claude reads the receipts you drop in Expenses, scans and photos included. Anthropic bills the key for each receipt read; without one, PDFs are read on your server.`)
};

const fr_integrations_anthropic_description = /** @type {(inputs: Integrations_Anthropic_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avec votre propre clé d'API Anthropic, Claude lit les reçus déposés dans Dépenses, scans et photos compris. Anthropic facture la clé à chaque reçu lu ; sans clé, les PDF sont lus sur votre serveur.`)
};

/**
* | output |
* | --- |
* | "With your own Anthropic API key, Claude reads the receipts you drop in Expenses, scans and photos included. Anthropic bills the key for each receipt read; wi..." |
*
* @param {Integrations_Anthropic_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_anthropic_description = /** @type {((inputs?: Integrations_Anthropic_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Anthropic_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_anthropic_description(inputs)
	return en_integrations_anthropic_description(inputs)
});