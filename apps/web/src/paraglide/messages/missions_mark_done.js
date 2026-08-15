/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Mark_DoneInputs */

const en_missions_mark_done = /** @type {(inputs: Missions_Mark_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as completed`)
};

const fr_missions_mark_done = /** @type {(inputs: Missions_Mark_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer comme terminée`)
};

/**
* | output |
* | --- |
* | "Mark as completed" |
*
* @param {Missions_Mark_DoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_mark_done = /** @type {((inputs?: Missions_Mark_DoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Mark_DoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_mark_done(inputs)
	return en_missions_mark_done(inputs)
});