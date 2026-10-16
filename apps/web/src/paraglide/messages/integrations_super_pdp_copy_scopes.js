/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Copy_ScopesInputs */

const en_integrations_super_pdp_copy_scopes = /** @type {(inputs: Integrations_Super_Pdp_Copy_ScopesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy the scopes`)
};

const fr_integrations_super_pdp_copy_scopes = /** @type {(inputs: Integrations_Super_Pdp_Copy_ScopesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copier les scopes`)
};

/**
* | output |
* | --- |
* | "Copy the scopes" |
*
* @param {Integrations_Super_Pdp_Copy_ScopesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_copy_scopes = /** @type {((inputs?: Integrations_Super_Pdp_Copy_ScopesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Copy_ScopesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_copy_scopes(inputs)
	return en_integrations_super_pdp_copy_scopes(inputs)
});