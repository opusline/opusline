/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Declarations_Expenses_CountInputs */

const en_declarations_expenses_count = /** @type {(inputs: Declarations_Expenses_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} expense`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} expenses`);
	return /** @type {LocalizedString} */ ("declarations_expenses_count");
};

const fr_declarations_expenses_count = /** @type {(inputs: Declarations_Expenses_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} dépense`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} dépenses`);
	return /** @type {LocalizedString} */ ("declarations_expenses_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} expense" |
* | "other" | "{count} expenses" |
*
* @param {Declarations_Expenses_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_expenses_count = /** @type {((inputs: Declarations_Expenses_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Expenses_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_expenses_count(inputs)
	return en_declarations_expenses_count(inputs)
});