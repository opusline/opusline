/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Sample_Workshop_DetailInputs */

const en_paste_sample_workshop_detail = /** @type {(inputs: Paste_Sample_Workshop_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Half a day with the team, minutes included`)
};

const fr_paste_sample_workshop_detail = /** @type {(inputs: Paste_Sample_Workshop_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Demi-journée avec l'équipe, compte rendu inclus`)
};

/**
* | output |
* | --- |
* | "Half a day with the team, minutes included" |
*
* @param {Paste_Sample_Workshop_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_sample_workshop_detail = /** @type {((inputs?: Paste_Sample_Workshop_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Sample_Workshop_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_sample_workshop_detail(inputs)
	return en_paste_sample_workshop_detail(inputs)
});