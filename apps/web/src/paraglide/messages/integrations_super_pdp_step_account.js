/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Step_AccountInputs */

const en_integrations_super_pdp_step_account = /** @type {(inputs: Integrations_Super_Pdp_Step_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create an account at app.superpdp.com with your SIRET and VAT number.`)
};

const fr_integrations_super_pdp_step_account = /** @type {(inputs: Integrations_Super_Pdp_Step_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez un compte sur app.superpdp.com avec votre SIRET et votre numéro de TVA.`)
};

/**
* | output |
* | --- |
* | "Create an account at app.superpdp.com with your SIRET and VAT number." |
*
* @param {Integrations_Super_Pdp_Step_AccountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_step_account = /** @type {((inputs?: Integrations_Super_Pdp_Step_AccountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Step_AccountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_step_account(inputs)
	return en_integrations_super_pdp_step_account(inputs)
});