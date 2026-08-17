/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Week_Billable_Non_BillableInputs */

const en_week_billable_non_billable = /** @type {(inputs: Week_Billable_Non_BillableInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} non-billable`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} non-billable`);
	return /** @type {LocalizedString} */ ("week_billable_non_billable");
};

const fr_week_billable_non_billable = /** @type {(inputs: Week_Billable_Non_BillableInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} non facturable`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} non facturables`);
	return /** @type {LocalizedString} */ ("week_billable_non_billable");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} non-billable" |
* | "other" | "{count} non-billable" |
*
* @param {Week_Billable_Non_BillableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_billable_non_billable = /** @type {((inputs: Week_Billable_Non_BillableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Billable_Non_BillableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_billable_non_billable(inputs)
	return en_week_billable_non_billable(inputs)
});