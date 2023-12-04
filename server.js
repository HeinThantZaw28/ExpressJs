const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logEvents");
const { errorHandler, error404 } = require("./middleware/errorHandler");
const subRouter = require("./routes/subdir");
const { rootRouter } = require("./routes/root");
const employeeRouter = require("./routes/api/employees");
const { corsOption } = require("./config/corsOptions");
const { registerRouter } = require("./routes/register");
const { authRouter } = require("./routes/auth");
const { verifyJWT } = require("./middleware/verifyJWT");
const { refreshTokenRouter } = require("./routes/refreshToken");
const { logoutRouter } = require("./routes/logout");
const { credentials } = require("./middleware/credentials");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(logger);

app.use(credentials);
app.use(cors(corsOption));

app.use(express.urlencoded({ extended: false }));

//build in middleware for json
app.use(express.json());

app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

app.use("/", rootRouter);
app.use("/register", registerRouter);
app.use("/login", authRouter);
app.use("/refresh", refreshTokenRouter);
app.use("/logout", logoutRouter);

app.use(verifyJWT); // verify authorization
app.use("/subdir", subRouter);
app.use("/employees", employeeRouter);

//404 middleware
app.all("*", error404);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
