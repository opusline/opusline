/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_ProvisionInputs */

const en_declarations_cfe_provision = /** @type {(inputs: Declarations_Cfe_ProvisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provision`)
};

const fr_declarations_cfe_provision = /** @type {(inputs: Declarations_Cfe_ProvisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provision`)
};

/**
* | output |
* | --- |
* | "Provision" |
*
* @param {Declarations_Cfe_ProvisionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_provision = /** @type {((inputs?: Declarations_Cfe_ProvisionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_ProvisionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_provision(inputs)
	return en_declarations_cfe_provision(inputs)
});