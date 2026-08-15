/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Live_RunningInputs */

const en_week_live_running = /** @type {(inputs: Week_Live_RunningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`running`)
};

const fr_week_live_running = /** @type {(inputs: Week_Live_RunningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`en cours`)
};

/**
* | output |
* | --- |
* | "running" |
*
* @param {Week_Live_RunningInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_live_running = /** @type {((inputs?: Week_Live_RunningInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Live_RunningInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_live_running(inputs)
	return en_week_live_running(inputs)
});