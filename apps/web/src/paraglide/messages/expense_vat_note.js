/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_NoteInputs */

const en_expense_vat_note = /** @type {(inputs: Expense_Vat_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A foreign supplier who charged you 20 % TVA goes under “FR 20 %”, not autoliquidation (a marketplace, or a US SaaS billing through a European entity when you gave no TVA number). The invoice decides, not the supplier's country.`)
};

const fr_expense_vat_note = /** @type {(inputs: Expense_Vat_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un fournisseur étranger qui vous a facturé 20 % de TVA est en « FR 20 % », pas en autoliquidation (ex. une place de marché, ou un SaaS américain qui facture via une entité européenne quand vous n'avez pas donné votre numéro de TVA). C'est la facture qui décide, pas le pays du fournisseur.`)
};

/**
* | output |
* | --- |
* | "A foreign supplier who charged you 20 % TVA goes under “FR 20 %”, not autoliquidation (a marketplace, or a US SaaS billing through a European entity when you..." |
*
* @param {Expense_Vat_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_note = /** @type {((inputs?: Expense_Vat_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_note(inputs)
	return en_expense_vat_note(inputs)
});