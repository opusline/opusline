/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Declarations_Cfe_ProvisionedInputs */

const en_declarations_cfe_provisioned = /** @type {(inputs: Declarations_Cfe_ProvisionedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Set aside · ${i?.count} month`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Set aside · ${i?.count} months`);
	return /** @type {LocalizedString} */ ("declarations_cfe_provisioned");
};

const fr_declarations_cfe_provisioned = /** @type {(inputs: Declarations_Cfe_ProvisionedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Provisionné · ${i?.count} mois`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Provisionné · ${i?.count} mois`);
	return /** @type {LocalizedString} */ ("declarations_cfe_provisioned");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Set aside · {count} month" |
* | "other" | "Set aside · {count} months" |
*
* @param {Declarations_Cfe_ProvisionedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_provisioned = /** @type {((inputs: Declarations_Cfe_ProvisionedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_ProvisionedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_provisioned(inputs)
	return en_declarations_cfe_provisioned(inputs)
});