/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Expenses_CountInputs */

const en_expenses_count = /** @type {(inputs: Expenses_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} expense`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} expenses`);
	return /** @type {LocalizedString} */ ("expenses_count");
};

const fr_expenses_count = /** @type {(inputs: Expenses_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} dépense`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} dépenses`);
	return /** @type {LocalizedString} */ ("expenses_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} expense" |
* | "other" | "{count} expenses" |
*
* @param {Expenses_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_count = /** @type {((inputs: Expenses_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_count(inputs)
	return en_expenses_count(inputs)
});