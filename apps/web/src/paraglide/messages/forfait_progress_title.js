/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forfait_Progress_TitleInputs */

const en_forfait_progress_title = /** @type {(inputs: Forfait_Progress_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Forfait billed`)
};

const fr_forfait_progress_title = /** @type {(inputs: Forfait_Progress_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Forfait facturé`)
};

/**
* | output |
* | --- |
* | "Forfait billed" |
*
* @param {Forfait_Progress_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const forfait_progress_title = /** @type {((inputs?: Forfait_Progress_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forfait_Progress_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_forfait_progress_title(inputs)
	return en_forfait_progress_title(inputs)
});