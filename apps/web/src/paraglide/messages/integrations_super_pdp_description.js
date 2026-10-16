/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_DescriptionInputs */

const en_integrations_super_pdp_description = /** @type {(inputs: Integrations_Super_Pdp_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline receives, and from 2027 sends, electronic invoices through Super PDP, a plateforme agréée, using your own Super PDP application: free at a freelancer's volumes.`)
};

const fr_integrations_super_pdp_description = /** @type {(inputs: Integrations_Super_Pdp_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline reçoit, et dès 2027 émet, les factures électroniques via Super PDP, une plateforme agréée, avec votre propre application Super PDP : gratuite aux volumes d'un indépendant.`)
};

/**
* | output |
* | --- |
* | "Opusline receives, and from 2027 sends, electronic invoices through Super PDP, a plateforme agréée, using your own Super PDP application: free at a freelance..." |
*
* @param {Integrations_Super_Pdp_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_description = /** @type {((inputs?: Integrations_Super_Pdp_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_description(inputs)
	return en_integrations_super_pdp_description(inputs)
});