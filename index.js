const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnection')
const port = process.env.PORT || 4000;
const authRoute = require('./routes/authRoute')
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRouter')
const categoryRouter = require('./routes/categoryRouter')
const blogCategoryRouter = require('./routes/blogCategoryRouter');
const brandRouter = require('./routes/brandRouter');
const couponRouter = require("./routes/couponRouter")



const bodyParser = require('body-parser')
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const { notFound, errorHandler } = require('./middleware/errorHandler');
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", authRoute);
app.use("/", productRouter);
app.use("/", blogRouter);
app.use("/", categoryRouter);
app.use("/", blogCategoryRouter);
app.use("/", brandRouter);
app.use("/", couponRouter);





app.use(notFound);
app.use(errorHandler);
dbConnect();

app.listen(port, () => {
    console.log(`Server is runnig at PORT ${port}`)
})