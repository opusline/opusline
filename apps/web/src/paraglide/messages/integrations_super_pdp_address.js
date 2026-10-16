/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ address: NonNullable<unknown> }} Integrations_Super_Pdp_AddressInputs */

const en_integrations_super_pdp_address = /** @type {(inputs: Integrations_Super_Pdp_AddressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Receiving address ${i?.address}`)
};

const fr_integrations_super_pdp_address = /** @type {(inputs: Integrations_Super_Pdp_AddressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Adresse de réception ${i?.address}`)
};

/**
* | output |
* | --- |
* | "Receiving address {address}" |
*
* @param {Integrations_Super_Pdp_AddressInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_address = /** @type {((inputs: Integrations_Super_Pdp_AddressInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_AddressInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_address(inputs)
	return en_integrations_super_pdp_address(inputs)
});