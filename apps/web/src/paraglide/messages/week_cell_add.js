/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Cell_AddInputs */

const en_week_cell_add = /** @type {(inputs: Week_Cell_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add`)
};

const fr_week_cell_add = /** @type {(inputs: Week_Cell_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter`)
};

/**
* | output |
* | --- |
* | "Add" |
*
* @param {Week_Cell_AddInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_cell_add = /** @type {((inputs?: Week_Cell_AddInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Cell_AddInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_cell_add(inputs)
	return en_week_cell_add(inputs)
});