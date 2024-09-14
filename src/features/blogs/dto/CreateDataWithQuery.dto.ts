export class CreateItemsWithQueryDto<T> {
    public pageSize: number;
    public pagesCount: number;
    public totalCount: number;
    public page: number;
    public items: T[]

    constructor(queryModel: any, items: any) {
        this.pageSize = queryModel.pageSize;
        this.pagesCount = queryModel.pagesCount;
        this.totalCount = queryModel.totalCount;
        this.page = queryModel.page;
        this.items = items;
    }
}
