/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_SubtitleInputs */

const en_catalog_subtitle = /** @type {(inputs: Catalog_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your usual services, ready to add to an invoice or a quote. Changing a price here does not change documents already issued.`)
};

const fr_catalog_subtitle = /** @type {(inputs: Catalog_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vos prestations habituelles, prêtes à ajouter à une facture ou à un devis. Changer un prix ici ne modifie pas les documents déjà émis.`)
};

/**
* | output |
* | --- |
* | "Your usual services, ready to add to an invoice or a quote. Changing a price here does not change documents already issued." |
*
* @param {Catalog_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_subtitle = /** @type {((inputs?: Catalog_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_subtitle(inputs)
	return en_catalog_subtitle(inputs)
});