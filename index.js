const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
const products = require('./mockdata');

const app = express();
const port = 3010;

app.use(cors());
app.use(express.static('static'));

//Endpoint 1: Get the products sorted by popularity
//<http://localhost:3000/products/sort/popularity>

// Common function for all sorting

function sortProductsByProperty(property, isAscending) {
  let sortedProducts = [];
  let allProducts = [...products];
  if (isAscending) {
    sortedProducts = allProducts.sort((a, b) => a[property] - b[property]);
  } else {
    sortedProducts = allProducts.sort((a, b) => b[property] - a[property]);
  }
  return sortedProducts;
}

app.get('/products/sort/popularity', (req, res) => {
  let results = sortProductsByProperty('rating', false);
  return res.status(200).json({ results });
});

//Endpoint 2: Get the products sorted by “high-to-low” price
//<http://localhost:3000/products/sort/price-high-to-low>

app.get('/products/sort/price-high-to-low', (req, res) => {
  let results = sortProductsByProperty('price', false);
  return res.status(200).json({ results });
});

//Endpoint 3: Get the products sorted by “low-to-high” price
//<http://localhost:3000/products/sort/price-low-to-high>

app.get('/products/sort/price-low-to-high', (req, res) => {
  let results = sortProductsByProperty('price', true);
  return res.status(200).json({ results });
});

//Endpoint 4: Filter the products based on the “RAM” option.
//<http://localhost:3000/products/filter/ram?ram=8>
function filterProductsByPropertyAndValue(property, value, isLessThan) {
  return products.filter((product) =>
    isLessThan ? product[property] <= value : product[property] >= value
  );
}

app.get('/products/filter/ram', (req, res) => {
  let ramValue = parseFloat(req.query.ram);
  let results = filterProductsByPropertyAndValue('ram', ramValue);
  return res.status(200).json({ results });
});

//Endpoint 5: Filter the products based on the “ROM” option.
//<http://localhost:3000/products/filter/rom?rom=64>

app.get('/products/filter/rom', (req, res) => {
  let romValue = parseFloat(req.query.rom);
  let results = filterProductsByPropertyAndValue('rom', romValue);
  return res.status(200).json({ results });
});

//Endpoint 6: Filter the products based on the “Brand” option.
//<http://localhost:3000/products/filter/brand?brand=apple>
function filterProductsByPropertyAndText(property, comparisionText) {
  return products.filter(
    (a) => a[property].toLowerCase() === comparisionText.toLowerCase()
  );
}

app.get('/products/filter/brand', (req, res) => {
  let comparisionText = req.query.brand;
  let results = filterProductsByPropertyAndText('brand', comparisionText);
  return res.status(200).json({ results });
});

//Endpoint 7: Filter the products based on the “OS” option.
//<http://localhost:3000/products/filter/os?os=Android>

app.get('/products/filter/os', (req, res) => {
  let comparisionText = req.query.os;
  let results = filterProductsByPropertyAndText('os', comparisionText);
  return res.status(200).json({ results });
});

//Endpoint 8: Filter the products based on the “Price” option.
//<http://localhost:3000/products/filter/price?price=30000>

app.get('/products/filter/price', (req, res) => {
  let price = parseFloat(req.query.price);
  let results = filterProductsByPropertyAndValue('price', price, true);
  return res.status(200).json({ results });
});

//Endpoint 8: Send original array of products
//<http://localhost:3000/products>

app.get('/products', (req, res) => {
  return res.status(200).json({ products });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
