const transaction = require("../models/transaction");
const sales = require("../models/sales");
const stock = require("../models/stock");
const promos = require("../models/promos");
const product = require("../models/product");
const users = require("../models/users");
const { nanoid } = require("nanoid");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

const createTransaction = async (req, res) => {
  try {
    //   id transaction
    const id = `transaction-${nanoid(16)}`;
    // memasukan data sales ke table
    const { products, coupon, user_id } = req.body;
    await users.getUserById(user_id);
    const checkPromos = await promos.getPromosByCoupon(coupon);
    const checkresult = new Promise(async (resolve, reject) => {
      // mengola data dan operasi

      let datasales = [];
      await products.map(async (item) => {
        try {
          const stockdata = await stock.getStockById(item.stock_id);

          // mengecek jumlah data stock
          if (stockdata !== undefined) {
            if (
              stockdata.quantity < 1 ||
              parseInt(item.quantity) > stockdata.quantity
            ) {
              throw new InvariantError("out of stock product");
            }
          }
          //   total price sales
          let totalsales = parseInt(item.quantity) * stockdata.price;
          //   cek coupon promos
          let discount;
          if (checkPromos !== undefined) {
            // cek apakah product yang dipilih terdaftar disuatu promo
            discount =
              checkPromos.product_id === stockdata.product_id
                ? checkPromos.discount
                : null;

            // cek discount jika ada kurangkan total dengan discount
            totalsales =
              discount !== null
                ? totalsales - parseFloat(discount) * totalsales
                : totalsales;
          }
          // mengurangkan data stock
          const newQuantity = stockdata.quantity - parseInt(item.quantity);

          //   kelola data
          const data = {
            transaction_id: id,
            newQuantity: newQuantity,
            total: totalsales,
          };
          const databody = { ...item, ...data };
          datasales.push(databody);
          // akan resolve ketika pengecekan berhasil
          if (datasales.length === products.length) {
            resolve(datasales);
          }
        } catch (error) {
          if (error instanceof ClientError) {
            if (error.statusCode === 404) {
              return reject(new NotFoundError(error.message));
            }
            return reject(new InvariantError(error.message));
          }
          return reject(new Error(error.message));
        }
      });
    });
    const salesdata = await checkresult;
    // ketika pengecekan data aman
    if (salesdata.length === products.length) {
      // memasukan data sales
      await salesdata.map(async (item) => {
        // mengurangkan stock berdasarkan jumlah yang dibeli
        await stock.patchStockQuantity(item.stock_id, item.newQuantity);
        // memasukan ke data sales
        await sales.postSales(item);
      });
      // memasukan data transaction
      const result = await transaction.postTransaction(id, req.body);
      return response.isSuccessHaveData(
        res,
        201,
        { id: result },
        "Create Data Transaction has been success"
      );
    }
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

const readDetailTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transactionResult = await transaction.getTransactions(id);
    const salesResult = await sales.getSalesByTransaction(id);

    // total transaction
    let total = parseInt(
      salesResult.find((item) => item.item_total).item_total
    );
    // cek discount
    let i = 0;
    //cek apakah coupon terpakai dalam suatu produk
    salesResult.map((item) => {
      i += 1;
      // kondisi agar item coupon dan discount tidak masuk dalam item total
      if (i < salesResult.length) {
        item.discount =
          item.coupon === transactionResult.coupon ? item.discount : null;
        item.coupon = item.discount !== null ? item.coupon : null;
      }
    });
    total = parseFloat(transactionResult.tax) * total + total;
    total = total + parseInt(transactionResult.delivery_cost);
    const data = {
      ...transactionResult,
      products: salesResult,
      total: total,
    };
    return response.isSuccessHaveData(
      res,
      200,
      data,
      "Read Detail Data Transaction has been success"
    );
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

const readAllData = async (req, res) => {
  try {
    const result = await transaction.getTransactions();

    let data = [];
    result.map((item) => {
      const total =
        parseFloat(item.tax) * parseInt(item.item_total) +
        parseInt(item.item_total) +
        parseInt(item.delivery_cost);
      item = { ...item, total: total };
      data.push(item);
    });
    return response.isSuccessHaveData(
      res,
      200,
      data,
      "Read All Data Transaction has been success"
    );
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

module.exports = { readAllData, createTransaction, readDetailTransactionById };
