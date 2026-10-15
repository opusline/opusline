/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown>, other: NonNullable<unknown> }} Expenses_Kpi_Total_SubInputs */

const en_expenses_kpi_total_sub = /** @type {(inputs: Expenses_Kpi_Total_SubInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} expense · ${i?.other}`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} expenses · ${i?.other}`);
	return /** @type {LocalizedString} */ ("expenses_kpi_total_sub");
};

const fr_expenses_kpi_total_sub = /** @type {(inputs: Expenses_Kpi_Total_SubInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} dépense · ${i?.other}`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} dépenses · ${i?.other}`);
	return /** @type {LocalizedString} */ ("expenses_kpi_total_sub");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} expense · {other}" |
* | "other" | "{count} expenses · {other}" |
*
* @param {Expenses_Kpi_Total_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_total_sub = /** @type {((inputs: Expenses_Kpi_Total_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Total_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_total_sub(inputs)
	return en_expenses_kpi_total_sub(inputs)
});