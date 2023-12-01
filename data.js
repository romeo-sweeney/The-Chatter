// mysql -u C4131F23U205 C4131F23U205 -p -h cse-mysql-classes-01.cse.umn.edu

// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "localhost",// this will work
  user: "C4131F23U205",
  database: "C4131F23U205",
  password: "42075", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.
async function addContact(data) {
  try {
      const validatedData = await contactValidity(data);

      const name = validatedData.contactName;
      const email = validatedData.contactEmail;
      const date = validatedData.dateScheduled;
      const apptType = validatedData.apptType;
      const service = validatedData.serviceType;
      const paymentType = validatedData.paymentType;

      const query = `
          INSERT INTO contacts (contactName, contactEmail, dateScheduled, apptType, serviceType, paymentType)
          VALUES (?, ?, ?, ?, ?, ?);
      `;

      const values = [name, email, date, apptType, service, paymentType];

      return await connPool.awaitQuery(query, values);
  } catch (error) {
      console.error(error.message);
      throw new Error("Invalid contact data");
  }
}

async function deleteContact(id) {
  try {
    const result = await connPool.awaitQuery("DELETE FROM contacts WHERE id=?;", [id]);
    // returns false if no rows were affected, else true if 1 row effected
    return result.affectedRows !== 0;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

async function getContacts() {
  return await connPool.awaitQuery("SELECT * FROM contacts;");
}

// getContacts().then(console.log);


async function addSale(message) {
  return await connPool.awaitQuery("INSERT INTO sale (saleText, startTime) VALUES (?, CURRENT_TIMESTAMP);", [message]);
}

async function endSale() {
  return await connPool.awaitQuery("UPDATE sale SET endtime = CURRENT_TIMESTAMP WHERE endtime IS NULL");
}

async function getAllSales() {
  return await connPool.awaitQuery("SELECT * FROM sale ORDER BY startTime DESC;")
}
// getAllSales().then(console.log)

async function getRecentSales() {
  let recentSales = await connPool.awaitQuery("SELECT * FROM sale ORDER BY startTime DESC LIMIT 3;")
  // return recentSales;
  let sales = [];
  for (let i = 0; i < recentSales.length; i++) {
    sales.push({"message": recentSales[i].saleText, "active": recentSales[i].endTime ? 0 : 1})
  }

  return sales;
}

async function contactValidity(data) {
  if (!("contactName" in data &&
        "contactEmail" in data &&
        "dateScheduled" in data &&
        "apptType" in data &&
        "serviceType" in data &&
        "submitVal" in data)) {
      throw new Error("Invalid contact data");
  }

  // When cash is unchecked, len is 6; when checked, len is 7. Also, check that paymentType attribute is present.
  if (Object.keys(data).length !== 6 && Object.keys(data).length !== 7) {
      throw new Error(`ERROR: Data length is [${Object.keys(data).length}].`);
  }

  let name = data["contactName"];
  let email = data["contactEmail"];
  let date = data["dateScheduled"];
  let apptType = data["apptType"];
  let service = data["serviceType"];
  let paymentType = "No";

  // Make sure date is in a valid format
  try {
      new Date(date);
  } catch (error) {
      throw new Error("Invalid date format");
  }

  // Ensure correct apptType
  if (apptType === "inperson" || apptType === "default") {
    apptType = "in person";
  } else if (apptType === "virtual") {
      apptType = "virtual";
  } else {
    throw new Error("Invalid apptType");
  }

  // Ensure correct service
  switch (service) {
    case "instore":
        service = "In Store Purchase";
        break;
    case "oneLesson":
        service = "One Lesson ($20)";
        break;
    case "twoLessons":
        service = "Two Lessons ($30)";
        break;
    case "unlimited":
        service = "Unlimited Plan ($50/month)";
        break;
    case "default":
        service = "In Store Purchase";
        break;
    default:
      throw new Error("Invalid serviceType");
  }

  // If paymentType is checked, then Yes for cash
  if ("paymentType" in data) {
    paymentType = "Yes";
  }

  if (data["submitVal"] !== "Submit") {
    throw new Error("Invalid submitVal");
  }

  return {
      "contactName": name,
      "contactEmail": email,
      "dateScheduled": date,
      "apptType": apptType,
      "serviceType": service,
      "paymentType": paymentType
  };
}


module.exports = {addContact, getContacts, deleteContact, addSale, endSale, getRecentSales}