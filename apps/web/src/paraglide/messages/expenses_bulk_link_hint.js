/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Bulk_Link_HintInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Déposez un PDF sur chaque ligne sélectionnée")
	return /** @type {LocalizedString} */ ("Drop a PDF on each selected row")
});