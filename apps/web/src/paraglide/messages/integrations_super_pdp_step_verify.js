/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Step_VerifyInputs */

const en_integrations_super_pdp_step_verify = /** @type {(inputs: Integrations_Super_Pdp_Step_VerifyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Let Super PDP verify your company (identity and Kbis); it takes one to three days.`)
};

const fr_integrations_super_pdp_step_verify = /** @type {(inputs: Integrations_Super_Pdp_Step_VerifyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Laissez Super PDP vérifier votre entreprise (identité et Kbis) : comptez un à trois jours.`)
};

/**
* | output |
* | --- |
* | "Let Super PDP verify your company (identity and Kbis); it takes one to three days." |
*
* @param {Integrations_Super_Pdp_Step_VerifyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_step_verify = /** @type {((inputs?: Integrations_Super_Pdp_Step_VerifyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Step_VerifyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_step_verify(inputs)
	return en_integrations_super_pdp_step_verify(inputs)
});