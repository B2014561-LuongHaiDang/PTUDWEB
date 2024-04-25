const { ObjectId } = require("mongodb");
class ContactService {
    constructor(client) {
        this.nhanvien = client.db().collection("staffs");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(nv) {
        const nhanvien = {
            hotennv: nv.hotennv,
            password: nv.password,
            chucvu: nv.chucvu,
            diachi: nv.diachi,
            sodienthoai: nv.sodienthoai,
            favorite: nv.favorite,
        };
        // Remove undefined fields
        Object.keys(nhanvien).forEach(
            (key) => nhanvien[key] === undefined && delete nhanvien[key]
        );
        return nhanvien;
    }

    async create(nv) {
        const existingUsers = await this.findByName(nv.name);
        if (existingUsers.length > 0) {
            return null;
        }
    
        const nhanvien = this.extractConactData(nv);
        const result = await this.nhanvien.insertOne(nhanvien);
        return result.insertedId;
    }

    async find(filter) {
        const cursor = await this.nhanvien.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.nhanvien.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, nv) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(nv);
        const result = await this.nhanvien.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.nhanvien.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async findFavorite() {
        return await this.find({ favorite: false });
    }

    async deleteAll() {
        const result = await this.nhanvien.deleteMany({});
        return result.deletedCount;
    }

    async login(username, password) {
        const user = await this.nhanvien.findOne({ hotennv: username });
        if (!user) {
            throw new Error("User not found");
        }
    
        // Kiểm tra mật khẩu
        if (user.password !== password) {
            throw new Error("Incorrect password");
        }
    
        // Trả về thông tin người dùng nếu xác thực thành công
        return user;
    }
}
module.exports = ContactService;