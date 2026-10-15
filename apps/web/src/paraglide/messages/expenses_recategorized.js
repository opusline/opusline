/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Expenses_RecategorizedInputs */

const en_expenses_recategorized = /** @type {(inputs: Expenses_RecategorizedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} expense recategorised`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} expenses recategorised`);
	return /** @type {LocalizedString} */ ("expenses_recategorized");
};

const fr_expenses_recategorized = /** @type {(inputs: Expenses_RecategorizedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} dépense reclassée`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} dépenses reclassées`);
	return /** @type {LocalizedString} */ ("expenses_recategorized");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} expense recategorised" |
* | "other" | "{count} expenses recategorised" |
*
* @param {Expenses_RecategorizedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_recategorized = /** @type {((inputs: Expenses_RecategorizedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_RecategorizedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_recategorized(inputs)
	return en_expenses_recategorized(inputs)
});