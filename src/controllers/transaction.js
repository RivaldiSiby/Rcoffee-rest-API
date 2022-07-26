const transaction = require("../models/transaction");
const sales = require("../models/sales");
const stock = require("../models/stock");
const promos = require("../models/promos");
const product = require("../models/product");
const decode = require("../helper/docedeToken");
const users = require("../models/users");
const { nanoid } = require("nanoid");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
// firebase
const { messaging } = require("../config/firebase");
const notif = messaging();
const createTransaction = async (req, res) => {
  try {
    //   id transaction
    const payload = await decode.decodeToken(req.header("Authorization"));

    const user_id = payload.id;
    const id = `transaction-${nanoid(16)}`;
    // memasukan data sales ke table
    const { products, coupon } = req.body;
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
      const body = { ...req.body, user_id: user_id };
      const result = await transaction.postTransaction(id, body);
      // remote notification push
      const data = {
        token:
          "d173jnJiTj-goIv0zeT9_N:APA91bHcRbzqIENm_zzyGHUoGESpX24seTfa2QOKT4sOTHfjClFCRDXLug9mfpfOEmv1zrpw8pppuWtTE-NXpJyj1Ydb4RKnN_Mzx_CQcD5Nudow_OXvsibGd-RMf5LnlsTk267aEGv3",
        notification: {
          body: "You have a transaction to process",
          title: "Hi, Admin",
        },
      };
      await notif.send(data);
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
    const transactionResult = await transaction.getTransactions(null, id, null);
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
    const payload = await decode.decodeToken(req.header("Authorization"));
    req.query.page = req.query.page === undefined ? 1 : req.query.page;
    const result = await transaction.getTransactions(payload, null, req.query);

    const { totalData, totalPage, data } = result;
    let datatrans = [];
    data.map((item) => {
      const total =
        parseFloat(item.tax) * parseInt(item.item_total) +
        parseInt(item.item_total) +
        parseInt(item.delivery_cost);
      item = { ...item, total: total };
      datatrans.push(item);
    });
    const nextPage = parseInt(req.query.page) + 1;
    const prevPage = parseInt(req.query.page) - 1;
    // path query
    let queryPath = "";
    queryPath +=
      req.query.limit !== undefined ? `limit=${req.query.limit}&` : "";
    // path query
    let next =
      nextPage > totalPage
        ? {}
        : { next: `/transaction?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/transaction?${queryPath}page=${prevPage}` };
    const meta = {
      totalData: totalData,
      totalPage: totalPage,
      page: req.query.page,
      ...next,
      ...prev,
    };
    return response.isSuccessHavePagination(
      res,
      200,
      datatrans,
      meta,
      "Read Data has been success"
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

const readLastDay = async (req, res) => {
  try {
    const result = await transaction.getTransactionReport("day");

    // tarik 7 hari terakhir
    const dateHandler = (date) => {
      return new Date(new Date().setDate(date)).toISOString();
    };
    let lastDay5 = new Date().getDate() - 5;
    let lastDay4 = new Date().getDate() - 4;
    let lastDay3 = new Date().getDate() - 3;
    let lastDay2 = new Date().getDate() - 2;
    let lastDay1 = new Date().getDate() - 1;
    let lastDay0 = new Date().getDate();

    lastDay5 = dateHandler(lastDay5);
    lastDay4 = dateHandler(lastDay4);
    lastDay3 = dateHandler(lastDay3);
    lastDay2 = dateHandler(lastDay2);
    lastDay1 = dateHandler(lastDay1);
    lastDay0 = dateHandler(lastDay0);

    const lastDay = [
      lastDay0.split("T")[0],
      lastDay1.split("T")[0],
      lastDay2.split("T")[0],
      lastDay3.split("T")[0],
      lastDay4.split("T")[0],
      lastDay5.split("T")[0],
    ];

    // total data

    let totalDay0 = 0;
    let totalDay1 = 0;
    let totalDay2 = 0;
    let totalDay3 = 0;
    let totalDay4 = 0;
    let totalDay5 = 0;

    result.map((item) => {
      // cek penjualan dalam satu hari
      if (
        new Date(item.created_at).toISOString().split("T")[0] === lastDay[0]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalDay0 += total;
      }
      if (
        new Date(item.created_at).toISOString().split("T")[0] === lastDay[1]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalDay1 += total;
      }
      if (
        new Date(item.created_at).toISOString().split("T")[0] === lastDay[2]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalDay2 += total;
      }
      if (
        new Date(item.created_at).toISOString().split("T")[0] === lastDay[3]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalDay3 += total;
      }
      if (
        new Date(item.created_at).toISOString().split("T")[0] === lastDay[4]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalDay4 += total;
      }
      if (
        new Date(item.created_at).toISOString().split("T")[0] === lastDay[5]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalDay5 += total;
      }
    });

    // day array
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = [
      {
        day: days[new Date(lastDay[5]).getDay()],
        date: lastDay[5],
        total: parseInt(totalDay5),
      },
      {
        day: days[new Date(lastDay[4]).getDay()],
        date: lastDay[4],
        total: parseInt(totalDay4),
      },
      {
        day: days[new Date(lastDay[3]).getDay()],
        date: lastDay[3],
        total: parseInt(totalDay3),
      },
      {
        day: days[new Date(lastDay[2]).getDay()],
        date: lastDay[2],
        total: parseInt(totalDay2),
      },
      {
        day: days[new Date(lastDay[1]).getDay()],
        date: lastDay[1],
        total: parseInt(totalDay1),
      },
      {
        day: days[new Date(lastDay[0]).getDay()],
        date: lastDay[0],
        total: parseInt(totalDay0),
      },
    ];

    return response.isSuccessHaveData(
      res,
      200,
      data,
      "Read Data Transaction has been success"
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
const readLastMonth = async (req, res) => {
  try {
    const result = await transaction.getTransactionReport("month");
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    // tarik 7 hari terakhir
    const monthHandler = (month) => {
      return new Date(new Date().setMonth(month)).toISOString();
    };
    let lastMonth5 = new Date().getMonth() - 5;
    let lastMonth4 = new Date().getMonth() - 4;
    let lastMonth3 = new Date().getMonth() - 3;
    let lastMonth2 = new Date().getMonth() - 2;
    let lastMonth1 = new Date().getMonth() - 1;
    let lastMonth0 = new Date().getMonth();

    lastMonth5 = monthHandler(lastMonth5);
    lastMonth4 = monthHandler(lastMonth4);
    lastMonth3 = monthHandler(lastMonth3);
    lastMonth2 = monthHandler(lastMonth2);
    lastMonth1 = monthHandler(lastMonth1);
    lastMonth0 = monthHandler(lastMonth0);

    const lastMonth = [
      `${new Date(lastMonth0).getMonth()}-${new Date(
        lastMonth0
      ).getFullYear()}`,
      `${new Date(lastMonth1).getMonth()}-${new Date(
        lastMonth1
      ).getFullYear()}`,
      `${new Date(lastMonth2).getMonth()}-${new Date(
        lastMonth2
      ).getFullYear()}`,
      `${new Date(lastMonth3).getMonth()}-${new Date(
        lastMonth3
      ).getFullYear()}`,
      `${new Date(lastMonth4).getMonth()}-${new Date(
        lastMonth4
      ).getFullYear()}`,
      `${new Date(lastMonth5).getMonth()}-${new Date(
        lastMonth5
      ).getFullYear()}`,
    ];

    // total data

    let totalMonth0 = 0;
    let totalMonth1 = 0;
    let totalMonth2 = 0;
    let totalMonth3 = 0;
    let totalMonth4 = 0;
    let totalMonth5 = 0;

    result.map((item) => {
      // cek penjualan dalam satu hari
      if (
        `${new Date(item.created_at).getMonth()}-${new Date(
          item.created_at
        ).getFullYear()}` === lastMonth[0]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalMonth0 += total;
      }
      if (
        `${new Date(item.created_at).getMonth()}-${new Date(
          item.created_at
        ).getFullYear()}` === lastMonth[1]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalMonth1 += total;
      }
      if (
        `${new Date(item.created_at).getMonth()}-${new Date(
          item.created_at
        ).getFullYear()}` === lastMonth[2]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalMonth2 += total;
      }
      if (
        `${new Date(item.created_at).getMonth()}-${new Date(
          item.created_at
        ).getFullYear()}` === lastMonth[3]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalMonth3 += total;
      }
      if (
        `${new Date(item.created_at).getMonth()}-${new Date(
          item.created_at
        ).getFullYear()}` === lastMonth[4]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalMonth4 += total;
      }
      if (
        `${new Date(item.created_at).getMonth()}-${new Date(
          item.created_at
        ).getFullYear()}` === lastMonth[5]
      ) {
        const total =
          parseFloat(item.tax) +
          parseInt(item.delivery_cost) +
          parseInt(item.item_total);
        totalMonth5 += total;
      }
    });

    const data = [
      {
        month: month[lastMonth[5].split("-")[0]],
        total: parseInt(totalMonth5),
      },
      {
        month: month[lastMonth[4].split("-")[0]],
        total: parseInt(totalMonth4),
      },
      {
        month: month[lastMonth[3].split("-")[0]],
        total: parseInt(totalMonth3),
      },
      {
        month: month[lastMonth[2].split("-")[0]],
        total: parseInt(totalMonth2),
      },
      {
        month: month[lastMonth[1].split("-")[0]],
        total: parseInt(totalMonth1),
      },
      {
        month: month[lastMonth[0].split("-")[0]],
        total: parseInt(totalMonth0),
      },
    ];

    return response.isSuccessHaveData(
      res,
      200,
      data,
      "Read Data Transaction has been success"
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
const softDeleteTransaction = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(req.body);
    const deleteHandler = new Promise((resolve, reject) => {
      let countData = 0;
      id.map(async (item) => {
        try {
          await transaction.softDelete(item);
          countData += 1;
          if (countData === id.length) {
            return resolve();
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
    await deleteHandler;
    return response.isSuccessNoData(res, 200, "Delete Data has been success");
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};
const confirmDoneTransaction = async (req, res) => {
  try {
    const { id } = req.body;
    const confirmHandler = new Promise((resolve, reject) => {
      let countData = 0;
      id.map(async (item) => {
        try {
          await transaction.doneTransaction(item);
          countData += 1;
          if (countData === id.length) {
            return resolve();
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
    await confirmHandler;
    return response.isSuccessNoData(res, 200, "Transaction is Done");
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

module.exports = {
  readLastDay,
  readAllData,
  createTransaction,
  readDetailTransactionById,
  softDeleteTransaction,
  confirmDoneTransaction,
  readLastMonth,
};
