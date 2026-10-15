/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Grid_HintInputs */



/**
* | output |
* | --- |
* | "Click a cell: 1 → 0.5 → empty" |
*
* @param {Cra_Grid_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_grid_hint = /** @type {((inputs?: Cra_Grid_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Grid_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Cliquez une cellule : 1 → 0,5 → vide")
	return /** @type {LocalizedString} */ ("Click a cell: 1 → 0.5 → empty")
});