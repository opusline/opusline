/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Ph_DesignationInputs */

const en_paste_prompt_ph_designation = /** @type {(inputs: Paste_Prompt_Ph_DesignationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name of the service`)
};

const fr_paste_prompt_ph_designation = /** @type {(inputs: Paste_Prompt_Ph_DesignationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom de la prestation`)
};

/**
* | output |
* | --- |
* | "Name of the service" |
*
* @param {Paste_Prompt_Ph_DesignationInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_ph_designation = /** @type {((inputs?: Paste_Prompt_Ph_DesignationInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Ph_DesignationInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_ph_designation(inputs)
	return en_paste_prompt_ph_designation(inputs)
});