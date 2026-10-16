/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Category_HintInputs */

const en_invoicing_category_hint = /** @type {(inputs: Invoicing_Category_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mandatory since 1 September 2026, with the client's SIREN (taken from its record) and, where it applies, the option for VAT on debits.`)
};

const fr_invoicing_category_hint = /** @type {(inputs: Invoicing_Category_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Obligatoire depuis le 1er septembre 2026, avec le SIREN du client (repris de sa fiche) et, le cas échéant, l'option pour la TVA sur les débits.`)
};

/**
* | output |
* | --- |
* | "Mandatory since 1 September 2026, with the client's SIREN (taken from its record) and, where it applies, the option for VAT on debits." |
*
* @param {Invoicing_Category_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_category_hint = /** @type {((inputs?: Invoicing_Category_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Category_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_category_hint(inputs)
	return en_invoicing_category_hint(inputs)
});