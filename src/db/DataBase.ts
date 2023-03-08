import QueryInterface from "src/interfaces/Query.interface";

// const AWSXRay = require('aws-xray-sdk-core');
// const captureMySQL = require('aws-xray-sdk-mysql');
// const mysql = captureMySQL(require('mysql2'));
// const AWS = require('aws-sdk');
// import {} from 'mysql2'
const mysql = require('mysql');

// const signer = new AWS.RDS.Signer({
//   region: process.env.DB_REGION,
//   hostname: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   username: process.env.DB_USER,
//   // passwod: process.env.DB_PWD
// })

export default class DataBase {
  // private static dataBaseInstance: DataBase;
  private mysql: any;

  constructor() {
    // this.mysql = mysql.createConnection({
    //   host     : process.env.DB_HOST,
    //   user     : process.env.DB_USER,
    //   port     : process.env.DB_PORT,
    //   database : process.env.DB_NAME,
    //   ssl      : 'Amazon RDS',
    //   authPlugins: { mysql_clear_password: () => () => signer.getAuthToken() }
    //   // password : process.env.DB_PWD
    // });
    // this.mysql.connect(function(error) {
    //   if (error) {
    //     return console.log('Error DB connection', error)
    //   }
    //   console.log('DB connected.')
    // });
  }

  async connect() {
    this.mysql = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      password: process.env.DB_PWD,
      // ssl: "Amazon RDS",
      // authPlugins: { mysql_clear_password: () => () => signer.getAuthToken() }
    });

    return new Promise(resolve => {
      this.mysql.connect(function(error) {
        if (error) {
          console.log("Error DB connection", error);
          return resolve({ error })
        }
        console.log("DB connected.");
        resolve({});
      });
    })
  }

  // async getInstance(): Promise<DataBase> {
  //   if (!DataBase.dataBaseInstance) {
  //     DataBase.dataBaseInstance = new DataBase();
  //     await this.connect();
  //   }

  //   return DataBase.dataBaseInstance;
  // }

  query(sqlQuery: QueryInterface): Promise<any> {
    // const self = this;
    return new Promise((resolve) => {
      try {
        this.mysql.query(sqlQuery, (error, results, fields) => {
          if (error) {
            return resolve({ error });
          }
          return resolve({ results, fields });
        })
      } catch(e) { resolve({ error: e })}
    });
  }

  // async basicSelect(tableName: String, _where?: String): Promise<any> {
  //   const where = _where !== undefined ? ` WHERE ${_where}` : '';
  //   const query =  'SELECT * FROM ' + tableName + where;
  //   console.log(query);
  //   const results = await this.mysql.query(query);
  //   return results
  // }

  async closeConnection(): Promise<void> {
    // this.mysql.release();
    await this.mysql.end();
  }

  // getMysqlInstance() {
  //   return this.mysql;
  // }
}

// export function getDBInstance() {
//   return mysql({
//     config: {
//       host     : process.env.DB_HOST,
//       port     : process.env.DB_PORT,
//       database : process.env.DB_NAME,
//       user     : process.env.DB_USER,
//       password : process.env.DB_PWD
//     }
//   });
// }

// export async function basicSelect(tableName: String, _where?: String): Promise<any> {
//   const where = _where !== undefined ? ` WHERE ${_where}` : '';
//   const query =  'SELECT * FROM ' + tableName + where;
//   console.log(query);
//   const results = await mysql.query(query);
//   return results
// }

// export async function closeConnection(): Promise<void> {
//   await mysql.end();
//   mysql.quit();
//   return;
// }
