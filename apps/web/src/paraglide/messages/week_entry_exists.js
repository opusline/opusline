/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ duration: NonNullable<unknown> }} Week_Entry_ExistsInputs */

const en_week_entry_exists = /** @type {(inputs: Week_Entry_ExistsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`An entry of ${i?.duration} already exists on that day.`)
};

const fr_week_entry_exists = /** @type {(inputs: Week_Entry_ExistsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Une entrée de ${i?.duration} existe déjà ce jour-là.`)
};

/**
* | output |
* | --- |
* | "An entry of {duration} already exists on that day." |
*
* @param {Week_Entry_ExistsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_entry_exists = /** @type {((inputs: Week_Entry_ExistsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Entry_ExistsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_entry_exists(inputs)
	return en_week_entry_exists(inputs)
});