/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Sample_WorkshopInputs */

const en_paste_sample_workshop = /** @type {(inputs: Paste_Sample_WorkshopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scoping workshop`)
};

const fr_paste_sample_workshop = /** @type {(inputs: Paste_Sample_WorkshopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Atelier de cadrage`)
};

/**
* | output |
* | --- |
* | "Scoping workshop" |
*
* @param {Paste_Sample_WorkshopInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_sample_workshop = /** @type {((inputs?: Paste_Sample_WorkshopInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Sample_WorkshopInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_sample_workshop(inputs)
	return en_paste_sample_workshop(inputs)
});