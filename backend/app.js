const port = process.env.PORT || 8080;
const app = require("./app/server");

app.listen(port, () => {
    console.log(`Node server listening at http://localhost:${port}`);
});