/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Step_DocumentInputs */

const en_cra_step_document = /** @type {(inputs: Cra_Step_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send`)
};

const fr_cra_step_document = /** @type {(inputs: Cra_Step_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyer`)
};

/**
* | output |
* | --- |
* | "Send" |
*
* @param {Cra_Step_DocumentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_step_document = /** @type {((inputs?: Cra_Step_DocumentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Step_DocumentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_step_document(inputs)
	return en_cra_step_document(inputs)
});