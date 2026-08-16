/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Chart_NoteInputs */

const en_revenue_chart_note = /** @type {(inputs: Revenue_Chart_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shown period in orange · click a month`)
};

const fr_revenue_chart_note = /** @type {(inputs: Revenue_Chart_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Période affichée en orange · cliquez un mois`)
};

/**
* | output |
* | --- |
* | "Shown period in orange · click a month" |
*
* @param {Revenue_Chart_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_chart_note = /** @type {((inputs?: Revenue_Chart_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Chart_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_chart_note(inputs)
	return en_revenue_chart_note(inputs)
});