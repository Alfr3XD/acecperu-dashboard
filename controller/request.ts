export interface RequestController<T> {
    status: "ok" | "error";
    error: any;
    data: T
}