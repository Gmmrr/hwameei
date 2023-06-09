import express, { json } from "express";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 9192;

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
});

import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

import fs from "fs";
const jsonPath = "./json/userprofile.json";
const itemList = "./json/productprofile.json";

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get("/recommendation", (req, res) => {
    res.sendFile(__dirname + "/recomendation.html");
});
app.get("/recommended", (req, res) => {
    res.sendFile(__dirname + "/recommended.html");
});
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});
app.get("/product", (req, res) => {
    res.sendFile(__dirname + "/product.html");
});
app.get("/shop", (req, res) => {
    res.sendFile(__dirname + "/shop.html");
});

let chosen_tag = new Array(21);
for (let i = 0; i < 21; i++) {
    chosen_tag[i] = 0;
}
app.post("/recommendation/sendtag", (req, res) => {
    chosen_tag = req.body;

    console.log(chosen_tag);
    res.send("nice");
});
app.post("/recommended/gettag", (req, res) => {
    res.send(chosen_tag);
});

app.post("/login/login", (req, res) => {
    const account = req.body.account;
    const password = req.body.password;

    console.log(account);
    console.log(password);

    fs.readFile(jsonPath, "utf8", (err, data) => {
        const data_obj = JSON.parse(data);
        if (err) {
            console.error(err);
            return;
        } else {
            let hasAccount = false;
            let account_index = -1;
            for (let i = 0; i < data_obj.length; i++) {
                if (data_obj[i].account == account) {
                    hasAccount = true;
                    account_index = i;
                    break;
                }
            }
            if (hasAccount) {
                if (data_obj[account_index].password != password) {
                    res.send("wrong password");
                    return;
                } else {
                    res.send("has this id");
                }
            } else {
                res.send("no such id");
            }
        }
    });
});
app.post("/login/signup", (req, res) => {
    const account = req.body.account;
    const password = req.body.password;
    const password_again = req.body.password_again;

    console.log('get "account": ' + account);
    console.log('get "password": ' + password);
    console.log('get "password_again": ' + password_again);

    if (password != password_again) {
        res.send("incorresponding password");
    } else {
        const new_user = {
            account: account,
            password: password,
            cart: [""],
        };
        fs.readFile(jsonPath, "utf8", (err, data) => {
            let data_obj = JSON.parse(data);
            if (err) {
                console.error(err);
                return;
            } else {
                let hasAccount = false;
                let account_index = -1;
                for (let i = 0; i < data_obj.length; i++) {
                    if (data_obj[i].account === account) {
                        hasAccount = true;
                        account_index = i;
                        break;
                    }
                }
                if (hasAccount) {
                    res.send("account exist already");
                    return;
                } else {
                    data_obj.push(new_user);
                    console.log(data_obj);
                    fs.writeFile(jsonPath, JSON.stringify(data_obj), "utf8", (err) => {
                        if (err) {
                            console.error("Error writing JSON file:", err);
                            return;
                        }
                    });
                    res.send("sign up success");
                }
            }
        });
    }
});
app.post("/login/data", (req, res) => {
    const account = req.body.account;
    const password = req.body.password;

    console.log(account);
    console.log(password);

    console.log("here");

    fs.readFile(jsonPath, "utf8", (err, data) => {
        const data_obj = JSON.parse(data);
        if (err) {
            console.error(err);
            return;
        } else {
            let account_index = -1;
            for (let i = 0; i < data_obj.length; i++) {
                if (data_obj[i].account === account) {
                    account_index = i;
                    break;
                }
            }
            console.log(data_obj[account_index]);
            res.send(data_obj[account_index]);
        }
    });
});

app.post("/cart/add", (req, res) => {
    const id = req.body.id;
    const account = req.body.account;
    console.log(id);
    console.log(account);

    fs.readFile(itemList, "utf8", (err, data) => {
        const data_obj = JSON.parse(data);
        if (err) {
            console.error(err);
            return;
        } else {
            let item_index = -1;
            for (let i = 0; i < data_obj.length; i++) {
                if (data_obj[i].id === id) {
                    item_index = i;
                    break;
                }
            }
            console.log(data_obj[item_index]);
            res.send(data_obj[item_index]);
        }
    });
    fs.readFile(jsonPath, "utf8", (err, data) => {
        let data_obj = JSON.parse(data);
        if (err) {
            console.error(err);
            return;
        } else {
            for (let i = 0; i < data_obj.length; i++) {
                if (data_obj[i].account === account) {
                    data_obj[i].cart.push(id);
                    break;
                }
            }
            fs.writeFile(jsonPath, JSON.stringify(data_obj), "utf8", (err) => {
                if (err) {
                    console.error("Error writing JSON file:", err);
                    return;
                }
            });
        }
    });
});
app.post("/cart/delete", (req, res) => {
    const id = req.body.id;
    const account = req.body.account;
    console.log(id);
    console.log(account);

    fs.readFile(jsonPath, "utf8", (err, data) => {
        let data_obj = JSON.parse(data);
        if (err) {
            console.error(err);
            return;
        } else {
            for (let i = 0; i < data_obj.length; i++) {
                if (data_obj[i].account === account) {
                    const index = data_obj[i].cart.indexOf(id);
                    if (index !== -1) {
                        data_obj[i].cart.splice(index, 1);
                    }
                    break;
                }
            }
            fs.writeFile(jsonPath, JSON.stringify(data_obj), "utf8", (err) => {
                if (err) {
                    console.error("Error writing JSON file:", err);
                    return;
                }
                res.send("success");
            });
        }
    });
});

app.post("/cart/get", (req, res) => {
    const account = req.body.account;
    console.log(account);

    fs.readFile(jsonPath, "utf8", (err, data) => {
        let data_obj = JSON.parse(data);
        if (err) {
            console.error(err);
            return;
        } else {
            for (let i = 0; i < data_obj.length; i++) {
                if (data_obj[i].account === account) {
                    let cart_index = [];
                    cart_index = data_obj[i].cart;
                    fs.readFile(itemList, "utf8", (err, data) => {
                        let item_obj = JSON.parse(data);
                        if (err) {
                            console.error(err);
                            return;
                        } else {
                            let cart_obj = [];
                            for (let j = 0; j < cart_index.length; j++) {
                                for (let k = 0; k < item_obj.length; k++) {
                                    if (cart_index[j] === item_obj[k].id) {
                                        cart_obj.push(item_obj[k]);
                                    }
                                }
                            }
                            res.send(cart_obj);
                        }
                    });
                    break;
                }
            }
        }
    });
});

app.post("/cart/getbyid", (req, res) => {
    const id = req.body.id;
    console.log(id);

    let recommend_obj = {};

    fs.readFile(itemList, "utf8", (err, data) => {
        let data_obj = JSON.parse(data);
        let recommend_obj = {};
        if (err) {
            console.error(err);
            return;
        } else {
            for (let i = 0; i < data_obj.length; i++) {
                console.log(data_obj[i].id);
                if (id == data_obj[i].id) {
                    recommend_obj = data_obj[i];
                    console.log(data_obj[i]);
                    break;
                }
            }
            console.log(recommend_obj);
            res.send(recommend_obj);
        }
    });
});
