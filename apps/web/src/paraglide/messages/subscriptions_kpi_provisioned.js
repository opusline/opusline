/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown>, amount: NonNullable<unknown> }} Subscriptions_Kpi_ProvisionedInputs */

const en_subscriptions_kpi_provisioned = /** @type {(inputs: Subscriptions_Kpi_ProvisionedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} set aside at ${i?.amount} / month`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} set aside at ${i?.amount} / month`);
	return /** @type {LocalizedString} */ ("subscriptions_kpi_provisioned");
};

const fr_subscriptions_kpi_provisioned = /** @type {(inputs: Subscriptions_Kpi_ProvisionedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} provisionné ${i?.amount} / mois`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} provisionnés ${i?.amount} / mois`);
	return /** @type {LocalizedString} */ ("subscriptions_kpi_provisioned");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} set aside at {amount} / month" |
* | "other" | "{count} set aside at {amount} / month" |
*
* @param {Subscriptions_Kpi_ProvisionedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_provisioned = /** @type {((inputs: Subscriptions_Kpi_ProvisionedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_ProvisionedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_provisioned(inputs)
	return en_subscriptions_kpi_provisioned(inputs)
});