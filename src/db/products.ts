import TequilaInterface from 'src/interfaces/Tequila.interface';
import { TABLE } from 'src/utils/consts';
import { mysql, basicSelect, closeConnection } from './db-conf';
import products from '../utils/products';

async function createProductsTable(): Promise<void> {
  const sql = 'CREATE TABLE IF NOT EXISTS products ('
    + ' `id` int NOT NULL AUTO_INCREMENT,'
    + ' `title` varchar(45) NOT NULL,'
    + ' `description` varchar(45) DEFAULT NULL,'
    + ' `price` int NOT NULL,'
    + ' `img` varchar(45) NOT NULL,'
    + ' PRIMARY KEY (`id`)'
    + ' )';

  return await mysql.transaction().query(sql).commit();
}

async function insertElements(): Promise<void> {
  const values = products.map(product => `('${product.id}', '${product.title}', '${product.description}', ${product.price}, '${product.img}')`);
  const sql = 'INSERT INTO products(`id`, `title`, `description`, `price`, `img`) VALUES ' + values.join();
  return await mysql.transaction().query(sql).commit();
}

export async function insertElement(product: TequilaInterface): Promise<number> {
  const values = ` ('${product.id}', '${product.title}', '${product.description}', ${product.price}, '${product.img}')`;
  const sql = 'INSERT INTO products(`id`, `title`, `description`, `price`, `img`) VALUES ' + values;
  const result = await mysql.transaction().query(sql).commit();
  closeConnection();
  return result.insertId;
}


// This function was executed manually
export async function initTable(): Promise<void> {
  await createProductsTable();
  const result = await getProducts();

  if (result.length === 0) {
    await insertElements();
  }
  closeConnection();
}

export async function getProducts(): Promise<TequilaInterface[]> {
  const result = await basicSelect(TABLE.products);
  closeConnection();
  return result;
}

export async function getProductById(id: number): Promise<TequilaInterface> {
  const result = await basicSelect(TABLE.products, `id=${id}`);
  closeConnection();
  return result[0];
}

