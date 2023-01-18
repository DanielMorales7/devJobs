// const express = require('express');
import express from 'express';

const app = express();

const port = process.env.PORT || 5000;

app.use('/', (req, res) => {

    res.send('funciona');
});

app.listen(port, () => {

    console.log(`El servidor está funcionando en el puerto ${port}`)

});