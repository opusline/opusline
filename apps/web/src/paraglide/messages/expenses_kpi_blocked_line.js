/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown>, amount: NonNullable<unknown> }} Expenses_Kpi_Blocked_LineInputs */

const en_expenses_kpi_blocked_line = /** @type {(inputs: Expenses_Kpi_Blocked_LineInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`+ ${i?.amount} blocked · ${i?.count} receipt to link`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`+ ${i?.amount} blocked · ${i?.count} receipts to link`);
	return /** @type {LocalizedString} */ ("expenses_kpi_blocked_line");
};

const fr_expenses_kpi_blocked_line = /** @type {(inputs: Expenses_Kpi_Blocked_LineInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`+ ${i?.amount} bloqués · ${i?.count} facture à lier`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`+ ${i?.amount} bloqués · ${i?.count} factures à lier`);
	return /** @type {LocalizedString} */ ("expenses_kpi_blocked_line");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "+ {amount} blocked · {count} receipt to link" |
* | "other" | "+ {amount} blocked · {count} receipts to link" |
*
* @param {Expenses_Kpi_Blocked_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_blocked_line = /** @type {((inputs: Expenses_Kpi_Blocked_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Blocked_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_blocked_line(inputs)
	return en_expenses_kpi_blocked_line(inputs)
});