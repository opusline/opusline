/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Remove_Confirm_BodyInputs */

const en_integrations_super_pdp_remove_confirm_body = /** @type {(inputs: Integrations_Super_Pdp_Remove_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline forgets the credentials. Super PDP keeps your account and the invoices it holds.`)
};

const fr_integrations_super_pdp_remove_confirm_body = /** @type {(inputs: Integrations_Super_Pdp_Remove_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline oublie les identifiants. Super PDP conserve votre compte et les factures qu'il détient.`)
};

/**
* | output |
* | --- |
* | "Opusline forgets the credentials. Super PDP keeps your account and the invoices it holds." |
*
* @param {Integrations_Super_Pdp_Remove_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_remove_confirm_body = /** @type {((inputs?: Integrations_Super_Pdp_Remove_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Remove_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_remove_confirm_body(inputs)
	return en_integrations_super_pdp_remove_confirm_body(inputs)
});