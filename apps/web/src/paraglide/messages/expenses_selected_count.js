/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Expenses_Selected_CountInputs */

const en_expenses_selected_count = /** @type {(inputs: Expenses_Selected_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} selected`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} selected`);
	return /** @type {LocalizedString} */ ("expenses_selected_count");
};

const fr_expenses_selected_count = /** @type {(inputs: Expenses_Selected_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} sélectionnée`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} sélectionnées`);
	return /** @type {LocalizedString} */ ("expenses_selected_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} selected" |
* | "other" | "{count} selected" |
*
* @param {Expenses_Selected_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_selected_count = /** @type {((inputs: Expenses_Selected_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Selected_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_selected_count(inputs)
	return en_expenses_selected_count(inputs)
});