/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Duration_Format_HintInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Format : 1 · 0,5 · 2h · 1h30 · 90m")
	return /** @type {LocalizedString} */ ("Format: 1 · 0.5 · 2h · 1h30 · 90m")
});