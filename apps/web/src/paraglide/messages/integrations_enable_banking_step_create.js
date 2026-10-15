/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Step_CreateInputs */

const en_integrations_enable_banking_step_create = /** @type {(inputs: Integrations_Enable_Banking_Step_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a production application in the Enable Banking control panel.`)
};

const fr_integrations_enable_banking_step_create = /** @type {(inputs: Integrations_Enable_Banking_Step_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez une application de production dans le panneau de contrôle Enable Banking.`)
};

/**
* | output |
* | --- |
* | "Create a production application in the Enable Banking control panel." |
*
* @param {Integrations_Enable_Banking_Step_CreateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_step_create = /** @type {((inputs?: Integrations_Enable_Banking_Step_CreateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Step_CreateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_step_create(inputs)
	return en_integrations_enable_banking_step_create(inputs)
});