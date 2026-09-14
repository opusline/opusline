/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Settlement_ProvisionedInputs */

const en_declarations_settlement_provisioned = /** @type {(inputs: Declarations_Settlement_ProvisionedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set aside on the business account`)
};

const fr_declarations_settlement_provisioned = /** @type {(inputs: Declarations_Settlement_ProvisionedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provisionné sur le compte pro`)
};

/**
* | output |
* | --- |
* | "Set aside on the business account" |
*
* @param {Declarations_Settlement_ProvisionedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_settlement_provisioned = /** @type {((inputs?: Declarations_Settlement_ProvisionedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Settlement_ProvisionedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_settlement_provisioned(inputs)
	return en_declarations_settlement_provisioned(inputs)
});