const transaction = require("../models/transaction");
const sales = require("../models/sales");
const stock = require("../models/stock");
const promos = require("../models/promos");
const { nanoid } = require("nanoid");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");

const createTransaction = async (req, res) => {
  try {
    //   id transaction
    const id = `transaction-${nanoid(16)}`;
    // memasukan data sales ke table
    const { products, coupon } = req.body;

    const checkPromos = await promos.getPromosByCoupon(coupon);

    await products.map(async (item) => {
      //   tarik data stock
      const stockdata = await stock.getStockById(item.stock_id);

      if (stockdata.length === 0) {
        throw new InvariantError("stock_id is invalid");
      }
      //   total price sales
      let totalsales = parseInt(item.quantity) * parseInt(stockdata.price_unit);
      //   cek coupon promos
      let discount;
      if (checkPromos !== undefined) {
        // cek apakah product yang dipilih terdaftar disuatu promo
        discount =
          checkPromos.product_id === item.product_id
            ? checkPromos.discount
            : null;

        // cek discount jika ada kurangkan total dengan discount
        totalsales =
          discount !== null
            ? totalsales - parseFloat(discount) * totalsales
            : totalsales;
      }
      //   kelola data
      const data = {
        transaction_id: id,
        discount: discount,
        total: totalsales,
      };
      const databody = { ...item, ...data };
      // mengecek jumlah data stock
      if (parseInt(stockdata.quantity) < 1) {
        throw new InvariantError("out of stock product");
      }
      // mengurangkan data stock
      const newQuantity =
        parseInt(stockdata.quantity) - parseInt(item.quantity);

      await stock.putStockQuantity(item.stock_id, newQuantity);
      // memasukan ke data sales
      await sales.postSales(databody);
    });
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
