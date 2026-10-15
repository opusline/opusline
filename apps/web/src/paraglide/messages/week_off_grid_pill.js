/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Off_Grid_PillInputs */

const en_week_off_grid_pill = /** @type {(inputs: Week_Off_Grid_PillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`not in the grid`)
};

const fr_week_off_grid_pill = /** @type {(inputs: Week_Off_Grid_PillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`hors grille`)
};

/**
* | output |
* | --- |
* | "not in the grid" |
*
* @param {Week_Off_Grid_PillInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_off_grid_pill = /** @type {((inputs?: Week_Off_Grid_PillInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Off_Grid_PillInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_off_grid_pill(inputs)
	return en_week_off_grid_pill(inputs)
});