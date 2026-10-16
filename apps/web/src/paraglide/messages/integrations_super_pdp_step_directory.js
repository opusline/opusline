/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Step_DirectoryInputs */

const en_integrations_super_pdp_step_directory = /** @type {(inputs: Integrations_Super_Pdp_Step_DirectoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Register your company in the annuaire from its Directory page, so other platforms can route invoices to you.`)
};

const fr_integrations_super_pdp_step_directory = /** @type {(inputs: Integrations_Super_Pdp_Step_DirectoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inscrivez votre entreprise dans l'annuaire depuis sa page Directory, pour que les autres plateformes puissent vous adresser des factures.`)
};

/**
* | output |
* | --- |
* | "Register your company in the annuaire from its Directory page, so other platforms can route invoices to you." |
*
* @param {Integrations_Super_Pdp_Step_DirectoryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_step_directory = /** @type {((inputs?: Integrations_Super_Pdp_Step_DirectoryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Step_DirectoryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_step_directory(inputs)
	return en_integrations_super_pdp_step_directory(inputs)
});