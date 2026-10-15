/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Live_PausedInputs */

const en_week_live_paused = /** @type {(inputs: Week_Live_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`paused`)
};

const fr_week_live_paused = /** @type {(inputs: Week_Live_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`en pause`)
};

/**
* | output |
* | --- |
* | "paused" |
*
* @param {Week_Live_PausedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_live_paused = /** @type {((inputs?: Week_Live_PausedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Live_PausedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_live_paused(inputs)
	return en_week_live_paused(inputs)
});