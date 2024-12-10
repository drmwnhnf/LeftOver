const { pool } = require("../configs/dbconfig");
const logger = require("../tools/logger");

async function getItembyId(req, res) {
  const { itemId } = req.params;
  try {
    const result = await pool.query(
      "SELECT i.itemid, i.name AS item_name, i.price, i.imageurl as imageurl, i.description, i.amount, i.expirationdate, a.accountid as sellerid, a.username AS seller_name, a.email AS seller_email, a.country AS seller_country, a.address AS seller_address, a.firstname AS firstname, a.surname AS surname, a.phonenumber as seller_phonee, a.district as district, a.imageurl as seller_image, a.city as seller_city FROM item i JOIN account a ON i.sellerid = a.accountid WHERE i.itemid = $1;",
      [itemId]
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: true,
        message: "Get failed! item not found",
        data: null,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Get success!",
      data: result.rows[0],
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

async function getAllItems(req, res) {
  try {
    const result = await pool.query(
      "SELECT item.*, account.accountid AS accid, account.username AS seller_name, account.firstname AS firstname, account.surname AS surname FROM item JOIN account ON item.sellerid = account.accountid"
    );
    res.status(200).json({
      success: true,
      message: "Get all items success!",
      data: result.rows,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

async function createItem(req, res) {
  const {
    sellerid,
    name,
    price,
    expirationDate,
    imageurl,
    description,
    itemCategories,
    itemCondition,
    amount,
  } = req.body;

  // Debugging log untuk memeriksa data yang diterima
  console.log("Request Body:", req.body);

  // Validasi input
  if (
    !name ||
    !price ||
    !expirationDate ||
    !imageurl ||
    !itemCondition ||
    !amount
  ) {
    console.error("Validation failed: Missing required fields");
    res.status(400).json({
      success: false,
      message: "Create Item Failed! Data not complete!",
      data: null,
    });
    return;
  }

  if (isNaN(price) || isNaN(amount)) {
    console.error("Validation failed: Price or amount is not a number");
    res.status(400).json({
      success: false,
      message: "Price and amount must be numbers!",
      data: null,
    });
    return;
  }

  if (!Array.isArray(itemCategories)) {
    console.error("Validation failed: itemCategories is not an array");
    res.status(400).json({
      success: false,
      message: "Item categories must be an array!",
      data: null,
    });
    return;
  }

  try {
    // Insert item ke tabel utama
    const insertQuery = await pool.query(
      "INSERT INTO item (sellerid, name, price, expirationDate, imageurl, description, amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING itemId",
      [sellerid, name, price, expirationDate, imageurl, description, amount]
    );
    console.log("Item created with ID:", insertQuery.rows[0].itemid);

    // Insert itemCondition
    await pool.query(
      "INSERT INTO itemconditions (itemId, itemcondition) VALUES ($1, $2)",
      [insertQuery.rows[0].itemid, itemCondition]
    );
    console.log("Item condition inserted:", itemCondition);

    // Insert itemCategories
    for (let category of itemCategories) {
      await pool.query(
        "INSERT INTO itemcategories (itemId, category) VALUES ($1, $2)",
        [insertQuery.rows[0].itemid, category]
      );
      console.log("Item category inserted:", category);
    }

    res.status(201).json({
      success: true,
      message: "Create Item Success!",
      data: insertQuery.rows[0],
    });
  } catch (error) {
    console.error("Error during item creation:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

// async function searchItem(req, res) {
//     const { searchQuery, itemCategory, itemCondition, page } = req.body;
//     try {
//         const queryResult = await pool.query(
//             "SELECT DISTINCT i.* FROM item i LEFT JOIN itemcategories ic ON i.itemId = ic.itemId LEFT JOIN itemconditions ico ON i.itemId = ico.itemId WHERE i.name ILIKE $1 AND (ic.category = $2 OR $2 IS NULL) AND (ico.itemcondition = $3 OR $3 IS NULL) LIMIT 25 OFFSET ($4 - 1) * 25",
//             [`%${searchQuery}%`, itemCategory, itemCondition, page]
//         );
//         res.status(200).json({
//             success: true,
//             message: "Search success!",
//             data: queryResult.rows
//         });
//         return
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             data: null
//         });
//     }
// }

async function searchItem(req, res) {
  const {
    searchQuery = "",
    page = 1,
    priceRange = [0, 1000000],
    categories = [],
    conditions = [],
    expirationDate = null,
  } = req.body;

  try {
    let filters = [];
    let values = [];
    let counter = 1;

    // Filter by search query (name)
    if (searchQuery) {
      filters.push(`i.name ILIKE $${counter}`);
      values.push(`%${searchQuery}%`);
      counter++;
    }

    // Filter by price range
    filters.push(`i.price BETWEEN $${counter} AND $${counter + 1}`);
    values.push(priceRange[0], priceRange[1]);
    counter += 2;

    // Filter by categories
    if (categories.length > 0) {
      const categoryPlaceholders = categories
        .map(() => `$${counter++}`)
        .join(", ");
      filters.push(`ic.category IN (${categoryPlaceholders})`);
      values.push(...categories);
    }

    // Filter by conditions
    if (conditions.length > 0) {
      const conditionPlaceholders = conditions
        .map(() => `$${counter++}`)
        .join(", ");
      filters.push(`icond.itemCondition IN (${conditionPlaceholders})`);
      values.push(...conditions);
    }

    // Filter by expiration date
    if (expirationDate) {
      filters.push(`i.expirationDate <= $${counter}`);
      values.push(expirationDate);
      counter++;
    }

    // Combine all filters
    const whereClause =
      filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    const query = `
      SELECT DISTINCT i.*, a.firstname, a.surname, a.email, a.username
      FROM item i
      LEFT JOIN account a ON i.sellerId = a.accountId
      LEFT JOIN itemcategories ic ON i.itemId = ic.itemId
      LEFT JOIN itemconditions icond ON i.itemId = icond.itemId
      ${whereClause}
      LIMIT 25 OFFSET ($${counter} - 1) * 25;
    `;

    values.push(page);

    const queryResult = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: "Search success!",
      data: queryResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}


async function deleteItem(req, res) {
  console.log("req.params:", req.params); // Debugging
  const { itemid } = req.params;
  console.log("Received itemid for deletion:", itemid); // Debugging
  try {
    const orderCheck = await pool.query(
      "SELECT * FROM order_table WHERE itemid = $1 AND status IN ('WAITING', 'ONGOING')",
      [itemid]
    );
    console.log("Order check result:", orderCheck.rows); // Debug

    if (orderCheck.rowCount !== 0) {
      res.status(400).json({
        success: false,
        message: "Delete failed! Item has ongoing orders!",
        data: null,
      });
      return;
    }

    const searchQuery = await pool.query(
      "SELECT * FROM item WHERE itemid = $1",
      [itemid]
    );
    console.log("Search query result:", searchQuery.rows); // Debug

    if (searchQuery.rowCount !== 0) {
      await pool.query("DELETE FROM item WHERE itemid = $1", [itemid]);
      await pool.query("DELETE FROM itemconditions WHERE itemid = $1", [
        itemid,
      ]);
      await pool.query("DELETE FROM itemcategories WHERE itemid = $1", [
        itemid,
      ]);
      await pool.query("DELETE FROM order_table WHERE itemid = $1", [itemid]);

      res.status(200).json({
        success: true,
        message: "Delete success!",
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Delete failed! Item not found!",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error in deleteItem:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

async function editItem(req, res) {
  const { itemId } = req.params;
  const {
    name,
    price,
    expirationDate,
    imageurl,
    description,
    amount,
    itemCategory,
    itemCondition,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE item
                 SET name = $1, price = $2, expirationDate = $3, imageurl = $4, description = $5, amount = $7
                 WHERE itemId = $6 RETURNING *`,
      [name, price, expirationDate, imageurl, description, itemId, amount]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Edit failed! Item not found",
        data: null,
      });
      return;
    }
    await pool.query(
      "UPDATE itemconditions SET itemcondition = $2 WHERE itemid = $1",
      [result.rows[0].itemid, itemCondition]
    );
    await pool.query("DELETE FROM itemcategories WHERE itemid = $1", [
      result.rows[0].itemid,
    ]);
    if (itemCategory.length != 0) {
      for (let i of itemCategory) {
        await pool.query(
          "INSERT INTO itemcategories (itemId, category) VALUES ($1, $2)",
          [result.rows[0].itemid, i]
        );
      }
    }
    res.status(200).json({
      success: true,
      message: "Edit success!",
      data: result.rows[0],
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

async function getItemsBySellerId(req, res) {
  const { sellerId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM item WHERE sellerid = $1",
      [sellerId]
    );
    res.status(200).json({
      success: true,
      message: "Get items success!",
      data: result.rows,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

module.exports = {
  createItem,
  searchItem,
  deleteItem,
  editItem,
  getItembyId,
  getAllItems,
  getItemsBySellerId,
};
