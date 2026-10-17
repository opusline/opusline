/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Reset_TemplateInputs */

const en_send_reset_template = /** @type {(inputs: Send_Reset_TemplateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to the template`)
};

const fr_send_reset_template = /** @type {(inputs: Send_Reset_TemplateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenir au modèle`)
};

/**
* | output |
* | --- |
* | "Back to the template" |
*
* @param {Send_Reset_TemplateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_reset_template = /** @type {((inputs?: Send_Reset_TemplateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Reset_TemplateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_reset_template(inputs)
	return en_send_reset_template(inputs)
});