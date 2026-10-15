/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Subscriptions_Kpi_Monthly_SubInputs */

const en_subscriptions_kpi_monthly_sub = /** @type {(inputs: Subscriptions_Kpi_Monthly_SubInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} monthly subscription`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} monthly subscriptions`);
	return /** @type {LocalizedString} */ ("subscriptions_kpi_monthly_sub");
};

const fr_subscriptions_kpi_monthly_sub = /** @type {(inputs: Subscriptions_Kpi_Monthly_SubInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} abonnement mensuel`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} abonnements mensuels`);
	return /** @type {LocalizedString} */ ("subscriptions_kpi_monthly_sub");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} monthly subscription" |
* | "other" | "{count} monthly subscriptions" |
*
* @param {Subscriptions_Kpi_Monthly_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_monthly_sub = /** @type {((inputs: Subscriptions_Kpi_Monthly_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_Monthly_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_monthly_sub(inputs)
	return en_subscriptions_kpi_monthly_sub(inputs)
});