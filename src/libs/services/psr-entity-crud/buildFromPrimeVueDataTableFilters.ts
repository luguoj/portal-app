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
                break
            case FilterMatchMode.LESS_THAN_OR_EQUAL_TO:
                break
            case FilterMatchMode.GREATER_THAN:
                break
            case FilterMatchMode.GREATER_THAN_OR_EQUAL_TO:
                break
            case FilterMatchMode.BETWEEN:
                break
            case FilterMatchMode.DATE_IS:
                break
            case FilterMatchMode.DATE_IS_NOT:
                break
            case FilterMatchMode.DATE_BEFORE:
                break
            case FilterMatchMode.DATE_AFTER:
                break
            default:
        }
    }
    return filterOptionsBuilder.get()
}