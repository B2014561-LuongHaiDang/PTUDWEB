const BillService = require("../services/bill.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BookService = require("../services/book.service");
const ContactService = require("../services/contact.service");

exports.create = async (req, res, next) => {
    try {
    const billService = new BillService(MongoDB.client);
    const document = await billService.create(req.body);
    return res.json({
        message: "Mượn sách thành công!",
        billId: document
    });
    } catch (error) {
        return next(new ApiError(500, "An error occurred while "));
    }
};

exports.findAll = async(req, res, next) =>{
    let bills = [];

    try{
        const billService = new BillService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const contactService = new ContactService(MongoDB.client);
        data = await billService.find({});
        for (const bill of data) {
            const book = await bookService.findById(bill.masach)
            const user = await contactService.findById(bill.madocgia);
            bills.push({...bill, ...book, ...user})

        }
      

    }catch(error){
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }
    return res.send(bills);
};

exports.findOne = async (req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id); 
        if(!document){
            return next(new ApiError(404, "Contact not found find"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async(req, res, next) => {
    if(Object.keys(req.body).length == 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try{
        const billService = new BillService(MongoDB.client);
        const document = await billService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Bill not found"));
        }
        console.log(document);
        return res.json({message:"Bill was updated successfully"});
    }catch(error){
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
};

exports.delete = async(req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message:"Contact was deleted successfully"});
    }catch (error){
        return next(
            new ApiError(
                500,
                `Could not delete contact with id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async(_req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const deletedCount = await bookService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    }catch(error){
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};

exports.findAllFavorite = async(_req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const documents = await bookService.findFavorite();
        return res.send(documents);
    }catch (error){
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favorite contacts"
            )
        );
    }
};


