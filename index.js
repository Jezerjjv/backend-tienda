const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { query } = require("express");
const db = require("./db");
const multer = require('multer')
const path = require('path');
const fs = require('fs');
var url = require('url');
const dir = "../../../../../../../xampp/htdocs/";
const axios = require('axios');
const dotenv = require('dotenv');
const webpack = require('webpack');
const http = require('http');
var imgbbUploader = require('imgbb-uploader');

const PORT = process.env.PORT || 3977;
const URL_CARPETA_FOTOS = "C:/Users/jezer/OneDrive/Documentos/Proyectos/tienda/frontend/src/_imagenes/";
const TOKEN = "259b2d2bb88db93aa54a2e50096280db"

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server corriendo en ${PORT}`);
});


app.get('/api/products', async (req, res) => {
    const sql = "SELECT * FROM product where visible = 1";
    db.query(sql, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});

app.get('/api/all/products', async (req, res) => {
    const sql = "SELECT * FROM product";
    db.query(sql, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});


app.get('/api/products/by/category/:id_category', async (req, res) => {
    const id = req.params.id_category;

    const sql = "SELECT * FROM product where id_categoria = ?";
    db.query(sql, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});

app.get('/api/products/by/name/:nombre', async (req, res) => {
    var nombre = req.params.nombre;
    nombre = "%" + nombre + "%";
    const sql = "SELECT * FROM product where nombre like ?";
    db.query(sql, nombre, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});


app.get('/api/categories', async (req, res) => {
    const sql = "SELECT * FROM categoria";
    db.query(sql, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});

app.post('/api/category/save', (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const sql = "INSERT INTO categoria (id, nombre) VALUES(?,?);";
    db.query(sql, [id, nombre], async (err, result) => {
        if (!err) return res.redirect(req.body.prevPage);
        res.send(err);
    });
});

app.post('/api/imagen/save', (req, res) => {
    const id = req.body.id;
    const imgs_seleccionadas = req.body.imgs_seleccionadas;
    const id_product = req.body.id_product;
    var imagenes = imgs_seleccionadas.split(",");

   imagenes.map((imagen, i) => {
        var siguienteId = +id+i;
        var url_imagen = URL_CARPETA_FOTOS + imagen;
        imgbbUploader(TOKEN, url_imagen)
            .then(response => {
                const sql = "INSERT INTO imagenes (id, id_product, url) VALUES(?,?,?);";
                db.query(sql, [siguienteId, id_product, response.display_url], async (err, result) => {
                    if(err)console.log(err)
                });
            }).then(r =>{
                res.redirect(req.body.prevPage)
            })
            .catch(error => console.error(1));
    })

});

app.get('/api/imagenes/:id_product', async (req, res) => {
    const id = req.params.id_product;
    const sql = "SELECT * FROM imagenes where id_product = ? order by id asc";
    db.query(sql, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});


app.get('/api/product/:id_product', async (req, res) => {
    const id = req.params.id_product;
    const sql = "SELECT * FROM product where id = ?";
    db.query(sql, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});

app.get('/api/product/visible/:visible/:id_product', async (req, res) => {
    const id = req.params.id_product;
    const visible = req.params.visible;
    console.log(visible);
    const sql = "UPDATE product SET visible = ? where id = ?";
    db.query(sql, [visible, id], async (err, result) => {
        console.log(err);
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});

app.delete('/api/delete/product/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM product where id = ?";
    db.query(sql, id, async (err, result) => {
        if (err != null) res.send(result);
        res.send(err);
    });
});

app.delete('/api/delete/category/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM categoria where id = ?";
    db.query(sql, id, async (err, result) => {
        if (err != null) res.send(result);
        res.send(err);
    });
});

app.get('/api/imagenes/:id_product', async (req, res) => {
    const id = req.params.id_product;
    const sql = "SELECT * FROM imagenes where id_product = ? order by id asc";
    db.query(sql, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});

app.delete('/api/delete/imagen/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM imagenes where id = ?";
    db.query(sql, id, async (err, result) => {
        if (err != null) res.send(result);
        res.send(err);
    });
});


app.post('/api/product/save', (req, res) => {
    const isEdit = req.body.isEdit;
    const id = req.body.id;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const precio_oferta = req.body.precio_oferta;
    const rating = req.body.rating;
    const id_categoria = req.body.categoria;
    const img_principal = req.body.img_principal;
    const is_new = req.body.is_new;
    const in_stock = req.body.in_stock;
    var url_imagen = URL_CARPETA_FOTOS + img_principal;
    imgbbUploader(TOKEN, url_imagen)
        .then(response => {
            var sql = "";
            if (isEdit) {
                sql = "UPDATE product SET nombre = ?, descripcion = ?, precio = ?, precio_oferta = ?, rating = ?, img_principal = ?, id_categoria = ?, is_new = ?, in_stock = ? where id = ?";
            } else {
                sql = "INSERT INTO product (nombre, descripcion, precio, precio_oferta, rating, img_principal, id_categoria, is_new, in_stock, id) VALUES(?,?,?,?,?,?,?,?,?,?);";
            }
            db.query(sql, [nombre, descripcion, precio, precio_oferta, rating, response.display_url, id_categoria, is_new, in_stock, id], async (err, result) => {
                if (err === null) {
                    res.send({ code: 201, result });
                } else {
                    res.send({ code: 202, err });
                }
            });
        })
        .catch(error => console.error(1));


});


app.post('/api/product/save2', (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const precio_oferta = req.body.precio_oferta;
    const rating = req.body.rating;
    const id_categoria = req.body.categoria;
    const img_principal = req.body.img_principal;
    const is_new = req.body.is_new;
    const in_stock = req.body.in_stock;
    const sql = "INSERT INTO product (nombre, descripcion, precio, precio_oferta, rating, id_categoria, img_principal, is_new, in_stock, id) VALUES(?,?,?,?,?,?,?,?,?,?);";

    db.query(sql, [nombre, descripcion, precio, precio_oferta, rating, id_categoria, img_principal, is_new, in_stock, id], async (err, result) => {
        if (!err) return res.redirect(req.body.prevPage);
    });
});


app.post('/api/login', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
    const sql = "SELECT nombre FROM user WHERE user= ? and password = ?";
    db.query(sql, [user, password], async (err, result) => {
        if (err === null) {
            if (result.length > 0) {
                res.send({ code: 201, result });
            } else {
                res.send({ code: 203, result: "Usuario no existe" });
            }
        } else {
            res.send({ code: 202, err });
        }
    });
})
