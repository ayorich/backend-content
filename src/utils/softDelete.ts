import * as mongoose from 'mongoose';

interface IOptions {
    excludeDeleted?: boolean;
}

export default (options?: IOptions) => (schema: mongoose.Schema): void => {
    const defaultOptions = {
        excludeDeleted: true,
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
    };

    const { excludeDeleted } = mergedOptions;

    schema.add({ deleted_at: { type: Date, default: null } });

    schema.pre('find', function () {
        const existingQuery = this.getQuery();
        const excludeDocQuery = {
            ...existingQuery,
            deleted_at: { $not: { $type: 9 } },
        };

        this.where(excludeDeleted ? excludeDocQuery : existingQuery);
    });

    schema.statics.softDeleteOne = function (
        condition: Object,
        option: Object
    ): mongoose.Document {
        return this.updateOne(
            condition,
            { $set: { deleted_at: new Date() } },
            option
        );
    };

    schema.statics.softDeleteMany = function (
        condition: Object,
        option: Object
    ): mongoose.Document {
        return this.updateMany(
            condition,
            { $set: { deleted_at: new Date() } },
            option
        );
    };

    schema.statics.restoreOne = function (
        condition: Object,
        option: Object
    ): mongoose.Document {
        return this.updateOne(
            condition,
            { $set: { deleted_at: null } },
            option
        );
    };

    schema.statics.restoreMany = function (
        condition: Object,
        option: Object
    ): mongoose.Document {
        return this.updateMany(
            condition,
            { $set: { deleted_at: null } },
            option
        );
    };
};
