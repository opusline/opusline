/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown>, count: NonNullable<unknown> }} Invoices_Overdue_Up_ToInputs */

const en_invoices_overdue_up_to = /** @type {(inputs: Invoices_Overdue_Up_ToInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} overdue · up to ${i?.days} d`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} overdue · up to ${i?.days} d`);
	return /** @type {LocalizedString} */ ("invoices_overdue_up_to");
};

const fr_invoices_overdue_up_to = /** @type {(inputs: Invoices_Overdue_Up_ToInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} échue · jusqu'à ${i?.days} j`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} échues · jusqu'à ${i?.days} j`);
	return /** @type {LocalizedString} */ ("invoices_overdue_up_to");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} overdue · up to {days} d" |
* | "other" | "{count} overdue · up to {days} d" |
*
* @param {Invoices_Overdue_Up_ToInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_overdue_up_to = /** @type {((inputs: Invoices_Overdue_Up_ToInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Overdue_Up_ToInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_overdue_up_to(inputs)
	return en_invoices_overdue_up_to(inputs)
});