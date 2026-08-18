/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ value: NonNullable<unknown> }} Week_Uninvoiced_LegendInputs */

const en_week_uninvoiced_legend = /** @type {(inputs: Week_Uninvoiced_LegendInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} not invoiced this week`)
};

const fr_week_uninvoiced_legend = /** @type {(inputs: Week_Uninvoiced_LegendInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} non facturés cette semaine`)
};

/**
* | output |
* | --- |
* | "{value} not invoiced this week" |
*
* @param {Week_Uninvoiced_LegendInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_uninvoiced_legend = /** @type {((inputs: Week_Uninvoiced_LegendInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Uninvoiced_LegendInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_uninvoiced_legend(inputs)
	return en_week_uninvoiced_legend(inputs)
});