/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_ResumeInputs */

const en_missions_resume = /** @type {(inputs: Missions_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Resume the mission`)
};

const fr_missions_resume = /** @type {(inputs: Missions_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reprendre la mission`)
};

/**
* | output |
* | --- |
* | "Resume the mission" |
*
* @param {Missions_ResumeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_resume = /** @type {((inputs?: Missions_ResumeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_ResumeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_resume(inputs)
	return en_missions_resume(inputs)
});