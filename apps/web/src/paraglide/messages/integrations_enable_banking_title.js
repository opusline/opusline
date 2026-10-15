/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_TitleInputs */

const en_integrations_enable_banking_title = /** @type {(inputs: Integrations_Enable_Banking_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank sync`)
};

const fr_integrations_enable_banking_title = /** @type {(inputs: Integrations_Enable_Banking_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Synchronisation bancaire`)
};

/**
* | output |
* | --- |
* | "Bank sync" |
*
* @param {Integrations_Enable_Banking_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_title = /** @type {((inputs?: Integrations_Enable_Banking_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_title(inputs)
	return en_integrations_enable_banking_title(inputs)
});