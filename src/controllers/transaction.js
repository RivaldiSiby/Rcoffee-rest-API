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
    console.log(checkPromos);
    const checkresult = new Promise((resolve, reject) => {
      // mengola data dan operasi
      products.map(async (item) => {
        try {
          const stockdata = await stock.getStockById(item.stock_id);

          if (stockdata.length === 0) {
            throw new InvariantError("stock_id is invalid");
          }
          // mengecek jumlah data stock
          if (
            parseInt(stockdata.quantity) < 1 ||
            parseInt(item.quantity) > parseInt(stockdata.quantity)
          ) {
            throw new InvariantError("out of stock product");
          }
          //   total price sales
          let totalsales =
            parseInt(item.quantity) * parseInt(stockdata.price_unit);
          //   cek coupon promos
          let discount;
          if (checkPromos !== undefined) {
            // cek apakah product yang dipilih terdaftar disuatu promo
            discount =
              checkPromos.product_id === stockdata.product_id
                ? checkPromos.discount
                : null;
            console.log(discount);
            console.log(checkPromos.product_id, stockdata.product_id);
            // cek discount jika ada kurangkan total dengan discount
            totalsales =
              discount !== null
                ? totalsales - parseFloat(discount) * totalsales
                : totalsales;
          }
          //   kelola data
          const data = {
            transaction_id: id,
            total: totalsales,
          };
          const databody = { ...item, ...data };

          // mengurangkan data stock
          const newQuantity =
            parseInt(stockdata.quantity) - parseInt(item.quantity);

          await stock.putStockQuantity(item.stock_id, newQuantity);
          // memasukan ke data sales
          const result = await sales.postSales(databody);
          resolve(result);
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

    await checkresult;
    const result = await transaction.postTransaction(id, req.body);
    return response.isSuccessHaveData(
      res,
      201,
      { id: result },
      "Create Data Transaction has been success"
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

const readDetailTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transactionResult = await transaction.getTransactions(id);
    const salesResult = await sales.getSalesByTransaction(id);

    // total transaction
    let total = parseInt(
      salesResult.find((item) => item.item_total).item_total
    );
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
