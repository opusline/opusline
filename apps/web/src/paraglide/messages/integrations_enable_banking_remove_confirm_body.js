/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Remove_Confirm_BodyInputs */

const en_integrations_enable_banking_remove_confirm_body = /** @type {(inputs: Integrations_Enable_Banking_Remove_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Syncing stops and the access to your bank is revoked. Movements already synced stay.`)
};

const fr_integrations_enable_banking_remove_confirm_body = /** @type {(inputs: Integrations_Enable_Banking_Remove_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La synchronisation s'arrête et l'accès à votre banque est révoqué. Les mouvements déjà synchronisés restent.`)
};

/**
* | output |
* | --- |
* | "Syncing stops and the access to your bank is revoked. Movements already synced stay." |
*
* @param {Integrations_Enable_Banking_Remove_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_remove_confirm_body = /** @type {((inputs?: Integrations_Enable_Banking_Remove_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Remove_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_remove_confirm_body(inputs)
	return en_integrations_enable_banking_remove_confirm_body(inputs)
});