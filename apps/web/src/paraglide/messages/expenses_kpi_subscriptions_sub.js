/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown>, yearly: NonNullable<unknown> }} Expenses_Kpi_Subscriptions_SubInputs */

const en_expenses_kpi_subscriptions_sub = /** @type {(inputs: Expenses_Kpi_Subscriptions_SubInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.yearly} / year · ${i?.count} subscription`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.yearly} / year · ${i?.count} subscriptions`);
	return /** @type {LocalizedString} */ ("expenses_kpi_subscriptions_sub");
};

const fr_expenses_kpi_subscriptions_sub = /** @type {(inputs: Expenses_Kpi_Subscriptions_SubInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.yearly} / an · ${i?.count} abonnement`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.yearly} / an · ${i?.count} abonnements`);
	return /** @type {LocalizedString} */ ("expenses_kpi_subscriptions_sub");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{yearly} / year · {count} subscription" |
* | "other" | "{yearly} / year · {count} subscriptions" |
*
* @param {Expenses_Kpi_Subscriptions_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_subscriptions_sub = /** @type {((inputs: Expenses_Kpi_Subscriptions_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Subscriptions_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_subscriptions_sub(inputs)
	return en_expenses_kpi_subscriptions_sub(inputs)
});