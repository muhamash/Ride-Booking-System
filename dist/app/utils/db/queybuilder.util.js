"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter(excludeField) {
        const filter = { ...this.query };
        if (filter) {
            for (const field of excludeField) {
                delete filter[field];
            }
        }
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    searchableField(searchableField) {
        const searchTerm = this.query?.search || "";
        const searchQuery = {
            $or: searchableField.map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        };
        this.modelQuery = this.modelQuery.find(searchQuery);
        return this;
    }
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    fields() {
        const fields = this.query.fields?.split(",").join(" ") || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    pagination() {
        const limit = Number(this.query.limit) || 5;
        const page = Number(this.query.page) || 1;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this;
    }
    async getMeta() {
        const totalDocuments = await this.modelQuery.model.countDocuments();
        const limit = Number(this.query.limit) || 5;
        const page = Number(this.query.page) || 1;
        const totalPage = Math.ceil(totalDocuments / limit);
        return {
            page,
            totalPage,
            limit,
            totalDocuments,
        };
    }
    ;
    populate(fields) {
        this.modelQuery = this.modelQuery.populate(fields);
        return this;
    }
    ;
    lean() {
        this.modelQuery = this.modelQuery.lean();
        return this;
    }
    ;
}
exports.QueryBuilder = QueryBuilder;
;
