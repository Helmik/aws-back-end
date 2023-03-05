import {} from 'serverless-mysql';
export const mysql = require('serverless-mysql')({
  config: {
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    database : process.env.DB_NAME,
    user     : process.env.DB_USER,
    password : process.env.DB_PWD
  }
});

export async function basicSelect(tableName: String, _where?: String): Promise<any> {
  const where = _where !== undefined ? ` WHERE ${_where}` : '';
  const query =  'SELECT * FROM ' + tableName + where;
  console.log(query);
  const results = await mysql.query(query);
  return results
}

export async function closeConnection(): Promise<void> {
  await mysql.end();
  mysql.quit();
  return;
}
