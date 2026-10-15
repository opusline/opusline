/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Remove_Confirm_TitleInputs */

const en_integrations_enable_banking_remove_confirm_title = /** @type {(inputs: Integrations_Enable_Banking_Remove_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove the Enable Banking application?`)
};

const fr_integrations_enable_banking_remove_confirm_title = /** @type {(inputs: Integrations_Enable_Banking_Remove_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer l'application Enable Banking ?`)
};

/**
* | output |
* | --- |
* | "Remove the Enable Banking application?" |
*
* @param {Integrations_Enable_Banking_Remove_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_remove_confirm_title = /** @type {((inputs?: Integrations_Enable_Banking_Remove_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Remove_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_remove_confirm_title(inputs)
	return en_integrations_enable_banking_remove_confirm_title(inputs)
});