/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_State_Pdf_ReadyInputs */

const en_cra_state_pdf_ready = /** @type {(inputs: Cra_State_Pdf_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF ready`)
};

const fr_cra_state_pdf_ready = /** @type {(inputs: Cra_State_Pdf_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF prêt`)
};

/**
* | output |
* | --- |
* | "PDF ready" |
*
* @param {Cra_State_Pdf_ReadyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_state_pdf_ready = /** @type {((inputs?: Cra_State_Pdf_ReadyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_State_Pdf_ReadyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_state_pdf_ready(inputs)
	return en_cra_state_pdf_ready(inputs)
});