/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Link_Debit_FailedInputs */

const en_expenses_link_debit_failed = /** @type {(inputs: Expenses_Link_Debit_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The expense was added, but the debit could not be linked to it.`)
};

const fr_expenses_link_debit_failed = /** @type {(inputs: Expenses_Link_Debit_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La dépense a été ajoutée, mais le prélèvement n'a pas pu lui être lié.`)
};

/**
* | output |
* | --- |
* | "The expense was added, but the debit could not be linked to it." |
*
* @param {Expenses_Link_Debit_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_link_debit_failed = /** @type {((inputs?: Expenses_Link_Debit_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Link_Debit_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_link_debit_failed(inputs)
	return en_expenses_link_debit_failed(inputs)
});