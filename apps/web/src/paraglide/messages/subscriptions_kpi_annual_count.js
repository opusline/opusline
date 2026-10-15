/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Subscriptions_Kpi_Annual_CountInputs */

const en_subscriptions_kpi_annual_count = /** @type {(inputs: Subscriptions_Kpi_Annual_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} annual subscription`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} annual subscriptions`);
	return /** @type {LocalizedString} */ ("subscriptions_kpi_annual_count");
};

const fr_subscriptions_kpi_annual_count = /** @type {(inputs: Subscriptions_Kpi_Annual_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} abonnement annuel`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} abonnements annuels`);
	return /** @type {LocalizedString} */ ("subscriptions_kpi_annual_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} annual subscription" |
* | "other" | "{count} annual subscriptions" |
*
* @param {Subscriptions_Kpi_Annual_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_annual_count = /** @type {((inputs: Subscriptions_Kpi_Annual_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_Annual_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_annual_count(inputs)
	return en_subscriptions_kpi_annual_count(inputs)
});