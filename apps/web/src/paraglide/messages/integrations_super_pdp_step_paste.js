/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Step_PasteInputs */

const en_integrations_super_pdp_step_paste = /** @type {(inputs: Integrations_Super_Pdp_Step_PasteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paste its client ID and client secret below.`)
};

const fr_integrations_super_pdp_step_paste = /** @type {(inputs: Integrations_Super_Pdp_Step_PasteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collez son client ID et son client secret ci-dessous.`)
};

/**
* | output |
* | --- |
* | "Paste its client ID and client secret below." |
*
* @param {Integrations_Super_Pdp_Step_PasteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_step_paste = /** @type {((inputs?: Integrations_Super_Pdp_Step_PasteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Step_PasteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_step_paste(inputs)
	return en_integrations_super_pdp_step_paste(inputs)
});