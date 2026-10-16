/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Integrations_Super_Pdp_CompanyInputs */

const en_integrations_super_pdp_company = /** @type {(inputs: Integrations_Super_Pdp_CompanyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`SIREN ${i?.number}`)
};

const fr_integrations_super_pdp_company = /** @type {(inputs: Integrations_Super_Pdp_CompanyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`SIREN ${i?.number}`)
};

/**
* | output |
* | --- |
* | "SIREN {number}" |
*
* @param {Integrations_Super_Pdp_CompanyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_company = /** @type {((inputs: Integrations_Super_Pdp_CompanyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_CompanyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_company(inputs)
	return en_integrations_super_pdp_company(inputs)
});