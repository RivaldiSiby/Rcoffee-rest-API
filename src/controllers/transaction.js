const transaction = require("../models/transaction");
const sales = require("../models/sales");
const stock = require("../models/stock");
const promos = require("../models/promos");
const { nanoid } = require("nanoid");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");

const createTransaction = async (req, res) => {
  try {
    //   id transaction
    const id = `transaction-${nanoid(16)}}`;

    // memasukan data sales ke table
    const { products, coupon, tax, delivery_cost } = req.body;
    let totaltransaction = 0;

    const checkPromos = await promos.getPromosByCoupon(coupon);

    products.map(async (item) => {
      //   tarik data stock
      const stockdata = await stock.getStockById(item.stock_id);
      //   total price sales
      let totalsales = parseInt(item.quantity) * parseInt(stockdata.price_unit);
      //   cek coupon promos
      let discount;
      if (!checkPromos.rows.length) {
        discount;
        // cek apakah product yang dipilih terdaftar disuatu promo
        checkPromos.product_id === item.product_id
          ? checkPromos.discount
          : null;

        // cek discount
        totalsales =
          discount !== null ? parseInt(discount) * totalsales : totalsales;
      }
      //   kelola data
      const data = {
        transaction_id: id,
        discount: discount,
        total: totalsales,
      };
      const databody = { ...item, ...data };
      totaltransaction += totalsales;
      await sales.postSales(databody);
    });
    // memasukan data transaction ke table
    // data untuk transaction
    const price = totaltransaction;
    let total =
      delivery_cost !== null ? price + parseInt(delivery_cost) : price;
    total = tax !== null ? total + parseInt(tax) * total : total;
    const bodytransaction = { ...req.body, total };
    const result = await transaction.postTransaction(id, bodytransaction);
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
