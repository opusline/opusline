/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Preview_TuesdayInputs */

const en_missions_preview_tuesday = /** @type {(inputs: Missions_Preview_TuesdayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tue`)
};

const fr_missions_preview_tuesday = /** @type {(inputs: Missions_Preview_TuesdayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mar`)
};

/**
* | output |
* | --- |
* | "Tue" |
*
* @param {Missions_Preview_TuesdayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_tuesday = /** @type {((inputs?: Missions_Preview_TuesdayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_TuesdayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_tuesday(inputs)
	return en_missions_preview_tuesday(inputs)
});