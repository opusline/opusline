/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Documents_Pending_CountInputs */

const en_documents_pending_count = /** @type {(inputs: Documents_Pending_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} file to sort`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} files to sort`);
	return /** @type {LocalizedString} */ ("documents_pending_count");
};

const fr_documents_pending_count = /** @type {(inputs: Documents_Pending_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} fichier à classer`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} fichiers à classer`);
	return /** @type {LocalizedString} */ ("documents_pending_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} file to sort" |
* | "other" | "{count} files to sort" |
*
* @param {Documents_Pending_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_pending_count = /** @type {((inputs: Documents_Pending_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Pending_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_pending_count(inputs)
	return en_documents_pending_count(inputs)
});