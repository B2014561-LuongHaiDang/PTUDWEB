const { ObjectId } = require("mongodb");

class BookService {
    constructor(client) {
        this.bookCollection = client.db().collection("books");
    }


    extractConactData(book) {
        const book_contact = {
            book_name: book.book_name,
            book_price: book.book_price,
            book_quantity: book.book_quantity,
            book_publishing_year: book.book_publishing_year,
            book_publishing_company: book.book_publishing_company,
            book_author: book.book_author,
            book_img: book.book_img,
            book_borrow: 1,
            favorite: book.favorite,
        };
        // Remove undefined fields
        Object.keys(book_contact).forEach(
            (key) => book_contact[key] === undefined && delete book_contact[key]
        );
        return book_contact;
    }


    async create(book) {
        const book_contact = this.extractConactData(book);
        const result = await this.bookCollection.findOneAndUpdate(
            book_contact,
            { $set: { favorite: book_contact.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.bookCollection.find(filter);
        return await cursor.toArray();
    }

    async findByName(book_name) {
        return await this.find({
            book_name: { $regex: new RegExp(book_name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.bookCollection.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, book) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(book);
        const result = await this.bookCollection.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.bookCollection.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async findFavorite() {
        return await this.find({ favorite: false });
    }

    async deleteAll() {
        const result = await this.bookCollection.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = BookService;