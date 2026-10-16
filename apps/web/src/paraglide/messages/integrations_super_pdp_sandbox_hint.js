/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Sandbox_HintInputs */

const en_integrations_super_pdp_sandbox_hint = /** @type {(inputs: Integrations_Super_Pdp_Sandbox_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sandbox credentials: nothing is filed with the administration.`)
};

const fr_integrations_super_pdp_sandbox_hint = /** @type {(inputs: Integrations_Super_Pdp_Sandbox_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identifiants de bac à sable : rien n'est transmis à l'administration.`)
};

/**
* | output |
* | --- |
* | "Sandbox credentials: nothing is filed with the administration." |
*
* @param {Integrations_Super_Pdp_Sandbox_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_sandbox_hint = /** @type {((inputs?: Integrations_Super_Pdp_Sandbox_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Sandbox_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_sandbox_hint(inputs)
	return en_integrations_super_pdp_sandbox_hint(inputs)
});