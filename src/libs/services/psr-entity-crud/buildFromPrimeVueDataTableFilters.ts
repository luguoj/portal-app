import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud/FilterOptionsBuilder";
import {FilterMatchMode} from "primevue/api";

export function buildFromPrimeVueDataTableFilters(filters: any) {
    const filterOptionsBuilder = new FilterOptionsBuilder()
    for (const field in filters) {
        const filter = filters[field]
        const valueRangesBuilder = filterOptionsBuilder.field(field)
        switch (filter.matchMode) {
            case FilterMatchMode.STARTS_WITH:
                if (filter.value) {
                    valueRangesBuilder.iLike(`${filter.value}%`)
                }
                break
            case FilterMatchMode.CONTAINS:
                if (filter.value) {
                    valueRangesBuilder.iLike(`%${filter.value}%`)
                }
                break
            case FilterMatchMode.NOT_CONTAINS:
                if (filter.value) {
                    valueRangesBuilder.iNLike(`%${filter.value}%`)
                }
                break
            case FilterMatchMode.ENDS_WITH:
                if (filter.value) {
                    valueRangesBuilder.iLike(`%${filter.value}`)
                }
                break
            case FilterMatchMode.EQUALS:
                valueRangesBuilder.iEqual(filter.value)
                break
            case FilterMatchMode.NOT_EQUALS:
                valueRangesBuilder.iNEqual(filter.value)
                break
            case FilterMatchMode.IN:
                valueRangesBuilder.iIN(filter.value)
                break
            case FilterMatchMode.LESS_THAN:
                valueRangesBuilder.iLT(filter.value)
                break
            case FilterMatchMode.LESS_THAN_OR_EQUAL_TO:
                valueRangesBuilder.iLE(filter.value)
                break
            case FilterMatchMode.GREATER_THAN:
                valueRangesBuilder.iGT(filter.value)
                break
            case FilterMatchMode.GREATER_THAN_OR_EQUAL_TO:
                valueRangesBuilder.iGE(filter.value)
                break
            case FilterMatchMode.BETWEEN:
                valueRangesBuilder.iBT(filter.value[0], filter.value[1])
                break
            case FilterMatchMode.DATE_IS:
                valueRangesBuilder.iEqual(filter.value)
                break
            case FilterMatchMode.DATE_IS_NOT:
                valueRangesBuilder.iNEqual(filter.value)
                break
            case FilterMatchMode.DATE_BEFORE:
                valueRangesBuilder.iLT(filter.value)
                break
            case FilterMatchMode.DATE_AFTER:
                valueRangesBuilder.iGT(filter.value)
                break
            default:
        }
    }
    return filterOptionsBuilder.get()
}