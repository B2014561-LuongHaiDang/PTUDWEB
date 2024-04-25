const { ObjectId } = require("mongodb");
class NhaxuatbanService {
    constructor(client) {
        this.nxb = client.db().collection("nxbs");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(company) {
        const nxb = {
            tennxb: company.tennxb,
            diachi: company.diachi,
            favorite: company.favorite,
        };
        // Remove undefined fields
        Object.keys(nxb).forEach(
            (key) => nxb[key] === undefined && delete nxb[key]
        );
        return nxb;
    }

    async create(company) {
        const existingUsers = await this.findByName(company.name);
        if (existingUsers.length > 0) {
            return null;
        }
    
        const nxb = this.extractConactData(company);
        const result = await this.nxb.insertOne(nxb);
        return result.insertedId;
    }

    async find(filter) {
        const cursor = await this.nxb.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.nxb.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, company) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(company);
        const result = await this.nxb.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.nxb.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async findFavorite() {
        return await this.find({ favorite: false });
    }

    async deleteAll() {
        const result = await this.nxb.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = NhaxuatbanService;