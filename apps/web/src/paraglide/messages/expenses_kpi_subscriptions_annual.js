/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Expenses_Kpi_Subscriptions_AnnualInputs */

const en_expenses_kpi_subscriptions_annual = /** @type {(inputs: Expenses_Kpi_Subscriptions_AnnualInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} annual`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} annual`);
	return /** @type {LocalizedString} */ ("expenses_kpi_subscriptions_annual");
};

const fr_expenses_kpi_subscriptions_annual = /** @type {(inputs: Expenses_Kpi_Subscriptions_AnnualInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`dont ${i?.count} annuel`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`dont ${i?.count} annuels`);
	return /** @type {LocalizedString} */ ("expenses_kpi_subscriptions_annual");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} annual" |
* | "other" | "{count} annual" |
*
* @param {Expenses_Kpi_Subscriptions_AnnualInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_subscriptions_annual = /** @type {((inputs: Expenses_Kpi_Subscriptions_AnnualInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Subscriptions_AnnualInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_subscriptions_annual(inputs)
	return en_expenses_kpi_subscriptions_annual(inputs)
});