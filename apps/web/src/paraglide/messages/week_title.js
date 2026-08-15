/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Week_TitleInputs */

const en_week_title = /** @type {(inputs: Week_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Week ${i?.number}`)
};

const fr_week_title = /** @type {(inputs: Week_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Semaine ${i?.number}`)
};

/**
* | output |
* | --- |
* | "Week {number}" |
*
* @param {Week_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_title = /** @type {((inputs: Week_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_title(inputs)
	return en_week_title(inputs)
});