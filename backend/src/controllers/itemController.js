const { pool } = require('../configs/dbconfig');
const logger = require('../tools/logger');

async function getItembyId(req, res) {
    const { itemId } = req.params;
    try {
        const result = await pool.query(
          "SELECT i.itemid, i.name AS item_name, i.price, i.imageurl, i.description, i.amount, i.expirationdate, a.username AS seller_name, a.email AS seller_email, a.country AS seller_country, a.address AS seller_address, a.firstname AS firstname, a.surname AS surname FROM item i JOIN account a ON i.sellerid = a.accountid WHERE i.itemid = $1;",
          [itemId]
        );
        if (result.rowCount === 0) {
            res.status(404).json({
                success: true,
                message: 'Get failed! item not found',
                data: null
                });
            return
        }
        res.status(200).json({
            success: true,
            message: "Get success!",
            data: result.rows[0]
        });
        return
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
        });
    }
}

async function getAllItems(req, res) {
  try {
    const result = await pool.query("SELECT item.*, account.username AS seller_name, account.firstname AS firstname, account.surname AS surname FROM item JOIN account ON item.sellerid = account.accountid");
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
    const {sellerId, name, price, expirationDate, imageURL, description, itemCategory, itemCondition, amount} = req.body;
    if (name.length === 0 || price.length === 0 || expirationDate.length === 0 || imageURL.length === 0 || itemCondition.length === 0 || amount === 0) {
        res.status(400).json({
            success: false,
            message: "Create Item Failed! Data not complete!",
            data: null
        });
        return
    }
    try {
        const insertQuery = await pool.query(
            "INSERT INTO item (sellerId, name, price, expirationDate, imageURL, description, amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING itemId",
            [sellerId, name, price, expirationDate, imageURL, description, amount]
        );
        await pool.query(
            "INSERT INTO itemconditions (itemId, itemcondition) VALUES ($1, $2)",
            [insertQuery.rows[0].itemid, itemCondition]
        );
        if (itemCategory.length != 0) {
            for (let i of itemCategory) {
                await pool.query(
                    "INSERT INTO itemcategories (itemId, category) VALUES ($1, $2)",
                    [insertQuery.rows[0].itemid, i]
                );
            }
        }
        res.status(201).json({
            success: true,
            message: "Create Item Success!",
            data: insertQuery.rows[0]
        });
        return
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
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
    searchQuery,
    itemCategory,
    itemCondition,
    page,
    priceRange,
    distanceRange,
    rating,
    selectedTags,
  } = req.body;

  try {
    const queryResult = await pool.query(
      `SELECT 
                i.*,
                a.firstname,
                a.surname,
                a.email,
                a.username
            FROM item i
            LEFT JOIN itemcategories ic ON i.itemId = ic.itemId
            LEFT JOIN itemconditions ico ON i.itemId = ico.itemId
            LEFT JOIN account a ON i.sellerid = a.accountid
            WHERE 
                i.name ILIKE $1 
                AND (ic.category = $2 OR $2 IS NULL) 
                AND (ico.itemcondition = $3 OR $3 IS NULL)
                AND (i.price BETWEEN $5 AND $6)
                AND (a.accountid IS NOT NULL)
            LIMIT 25 
            OFFSET ($4 - 1) * 25`,
      [
        `%${searchQuery}%`,
        itemCategory,
        itemCondition,
        page,
        priceRange[0] || 0,
        priceRange[1] || 1000000,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Search success!",
      data: queryResult.rows.map((item) => ({
        ...item,
        seller: {
          firstname: item.firstname,
          lastname: item.surnamename,
          email: item.email,
          username: item.username,
        },
      })),
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
    const { itemId } = req.params;
    try {
        const orderCheck = await pool.query(
            "SELECT * AS count FROM order WHERE itemId = $1 AND status IN ('WAITING', 'ONGOING')",
            [itemId]
        );
        if (orderCheck.rowCount != 0) {
            res.status(400).json({
                success: false,
                message: "Delete failed! Item has ongoing orders!",
                data: null
            });
            return
        }
        const searchQuery = await pool.query(
            "SELECT * FROM item WHERE itemid = $1",
            [itemId]
        );
        if (searchQuery.rowCount != 0) {
            await pool.query(
                "DELETE FROM item WHERE itemid = $1",
                [itemId]
            );
            await pool.query(
                "DELETE FROM itemconditions WHERE itemid = $1",
                [itemId]
            );
            await pool.query(
                "DELETE FROM itemcategories WHERE itemid = $1",
                [itemId]
            );
            await pool.query(
                "DELETE FROM order WHERE itemid = $1",
                [itemId]
            );
            res.status(200).json({
                success: true,
                message: "Delete success!",
                data: null
            });
            return
        }
        else {
            res.status(404).json({
                success: false,
                message: "Delete failed! note not found!",
                data: null
            });
            return
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
        });
    }
}

async function editItem(req, res) {
    const { itemId } = req.params;
    const { name, price, expirationDate, imageURL, description, amount, itemCategory, itemCondition } = req.body;

    try {
        const result = await pool.query(
            `UPDATE item
                 SET name = $1, price = $2, expirationDate = $3, imageURL = $4, description = $5, amount = $7
                 WHERE itemId = $6 RETURNING *`,
            [name, price, expirationDate, imageURL, description, itemId, amount]
        );

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: 'Edit failed! Item not found',
                data: null
            });
            return
        }
        await pool.query(
            "UPDATE itemconditions SET itemcondition = $2 WHERE itemid = $1",
            [result.rows[0].itemid, itemCondition]
        );
        await pool.query(
            "DELETE FROM itemcategories WHERE itemid = $1",
            [result.rows[0].itemid]
        );
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
            data: result.rows[0]
        });
        return
    } catch (error) {
        logger.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }
}

module.exports = {
    createItem,
    searchItem,
    deleteItem,
    editItem,
    getItembyId,
    getAllItems
}