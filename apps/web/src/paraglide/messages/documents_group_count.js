/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Documents_Group_CountInputs */

const en_documents_group_count = /** @type {(inputs: Documents_Group_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} document`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} documents`);
	return /** @type {LocalizedString} */ ("documents_group_count");
};

const fr_documents_group_count = /** @type {(inputs: Documents_Group_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} document`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} documents`);
	return /** @type {LocalizedString} */ ("documents_group_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} document" |
* | "other" | "{count} documents" |
*
* @param {Documents_Group_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_group_count = /** @type {((inputs: Documents_Group_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Group_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_group_count(inputs)
	return en_documents_group_count(inputs)
});