/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_No_AddressInputs */

const en_integrations_super_pdp_no_address = /** @type {(inputs: Integrations_Super_Pdp_No_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not registered in the annuaire yet: other platforms cannot route invoices to you.`)
};

const fr_integrations_super_pdp_no_address = /** @type {(inputs: Integrations_Super_Pdp_No_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas encore inscrit dans l'annuaire : les autres plateformes ne peuvent pas vous adresser de factures.`)
};

/**
* | output |
* | --- |
* | "Not registered in the annuaire yet: other platforms cannot route invoices to you." |
*
* @param {Integrations_Super_Pdp_No_AddressInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_no_address = /** @type {((inputs?: Integrations_Super_Pdp_No_AddressInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_No_AddressInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_no_address(inputs)
	return en_integrations_super_pdp_no_address(inputs)
});