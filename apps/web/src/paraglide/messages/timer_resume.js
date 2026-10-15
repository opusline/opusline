/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_ResumeInputs */

const en_timer_resume = /** @type {(inputs: Timer_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Resume`)
};

const fr_timer_resume = /** @type {(inputs: Timer_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reprendre`)
};

/**
* | output |
* | --- |
* | "Resume" |
*
* @param {Timer_ResumeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_resume = /** @type {((inputs?: Timer_ResumeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_ResumeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_resume(inputs)
	return en_timer_resume(inputs)
});