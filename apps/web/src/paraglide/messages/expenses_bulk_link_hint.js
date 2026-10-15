/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Bulk_Link_HintInputs */

const en_expenses_bulk_link_hint = /** @type {(inputs: Expenses_Bulk_Link_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drop a PDF on each selected row`)
};

const fr_expenses_bulk_link_hint = /** @type {(inputs: Expenses_Bulk_Link_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déposez un PDF sur chaque ligne sélectionnée`)
};

/**
* | output |
* | --- |
* | "Drop a PDF on each selected row" |
*
* @param {Expenses_Bulk_Link_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_bulk_link_hint = /** @type {((inputs?: Expenses_Bulk_Link_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Bulk_Link_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_bulk_link_hint(inputs)
	return en_expenses_bulk_link_hint(inputs)
});