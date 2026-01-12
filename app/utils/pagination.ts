export function paginate<T>(
    data: T[],
    page: number,
    pageSize: number
) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
        slice: data.slice(start, end),
        total: data.length,
        totalPages: Math.ceil(data.length / pageSize),
        from: start + 1,
        to: Math.min(end, data.length),
    };
}
