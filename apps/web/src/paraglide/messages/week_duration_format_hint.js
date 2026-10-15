/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Duration_Format_HintInputs */

const en_week_duration_format_hint = /** @type {(inputs: Week_Duration_Format_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Format: 1 · 0.5 · 2h · 1h30 · 90m`)
};

const fr_week_duration_format_hint = /** @type {(inputs: Week_Duration_Format_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Format : 1 · 0,5 · 2h · 1h30 · 90m`)
};

/**
* | output |
* | --- |
* | "Format: 1 · 0.5 · 2h · 1h30 · 90m" |
*
* @param {Week_Duration_Format_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_duration_format_hint = /** @type {((inputs?: Week_Duration_Format_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Duration_Format_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_duration_format_hint(inputs)
	return en_week_duration_format_hint(inputs)
});