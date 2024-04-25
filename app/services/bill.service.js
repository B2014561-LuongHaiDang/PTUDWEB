const { ObjectId } = require("mongodb");

class BillService {
    constructor(client) {
        this.billCollection = client.db().collection("bills");
    }


    extractConactData(bill) {
        const bill_follow = {
            madocgia: bill.madocgia,
            masach: bill.masach,
            soluong: bill.soluong,
            ngaymuon: bill.ngaymuon,
            ngaytra: bill.ngaytra,
            trangthai: bill.trangthai,
        };
        // Remove undefined fields
        Object.keys(bill_follow).forEach(
            (key) => bill_follow[key] === undefined && delete bill_follow[key]
        );
        return bill_follow;
    }


    async create(bill) {
        const bill_follow = this.extractConactData(bill);
        const result = await this.billCollection.insertOne(bill_follow);
        return result.insertedId;
    }

    async find(filter) {
        const cursor = await this.billCollection.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.billCollection.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, bill) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(bill);
        const result = await this.billCollection.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.billCollection.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async findFavorite() {
        return await this.find({ favorite: false });
    }

    async deleteAll() {
        const result = await this.billCollection.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = BillService;