const express = require("express");

const cors = require("cors");

const contactsRouter = require("./app/routes/contact.route");
const booksRouter = require("./app/routes/book.route");
const billsRouter = require("./app/routes/bill.route");
const nxbsRouter = require("./app/routes/nxb.route");
const staffsRouter = require("./app/routes/staff.route");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/books", booksRouter);
app.use("/api/bills",billsRouter);
app.use("/api/nxbs",nxbsRouter);
app.use("/api/staffs",staffsRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    });
});

app.get("/", (req, res) =>{
    res.json({message: "Welcomed to contact book application."});
});

module.exports = app;