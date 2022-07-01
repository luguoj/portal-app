import {Page, Pageable, ValueRange} from "@/libs/services/psr-entity-crud";
import {DataTableFilterMeta} from "primevue/datatable";
import {buildFromPrimeVueDataTableFilters} from "@/libs/services/psr-entity-crud/buildFromPrimeVueDataTableFilters";
import {reactive, watch} from "vue";

export class PsrFilterPagingDataTableModel<E> {
    loadDataHandler: (filter: Record<string, ValueRange[]>, pageable: Pageable) => Promise<Page<E>>
    defaultFilters: () => DataTableFilterMeta

    pageable: Pageable = {
        offset: 0,
        limit: 20,
    }
    limitSelectOptions: number[] = [10, 20, 50, 100]
    data: Page<E> = {
        content: [],
        totalElements: 0,
        totalPages: 0
    }
    loading: boolean = false
    filters: DataTableFilterMeta

    load(page?: number) {
        if (page && this.pageable.limit) {
            this.pageable.offset = page * this.pageable.limit
        }
        this.loading = true
        const filterOptions = buildFromPrimeVueDataTableFilters(this.filters)
        return this.loadDataHandler(filterOptions, this.pageable).then(data => {
            this.data = data
        }).finally(() => this.loading = false)
    }

    clearFilters() {
        this.filters = this.defaultFilters()
    }

    constructor(
        loadDataHandler: (filter: Record<string, ValueRange[]>, pageable: Pageable) => Promise<Page<E>>,
        defaultFilters: () => DataTableFilterMeta
    ) {
        this.loadDataHandler = loadDataHandler
        this.defaultFilters = defaultFilters
        this.filters = defaultFilters()
        watch(() => this.pageable.limit, () => this.load(0))
    }

    static create<E>(
        options: {
            loadDataHandler: (filter: Record<string, ValueRange[]>, pageable: Pageable) => Promise<Page<E>>,
            defaultFilters: () => DataTableFilterMeta
        }
    ) {
        return reactive(new PsrFilterPagingDataTableModel(
            options.loadDataHandler,
            options.defaultFilters
        ))
    }
}