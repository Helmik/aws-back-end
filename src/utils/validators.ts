import TequilaInterface from "src/interfaces/Tequila.interface";

export function buildProduct(objStr: any): TequilaInterface | null {
  const obj = JSON.parse(objStr);
  console.log(obj.title , !isNaN(parseInt(obj.price)) , obj.img)
  if (obj.title && !isNaN(parseInt(obj.price)) && obj.img) {
    return {
      title: obj.title,
      description: obj.description,
      price: obj.price,
      img: obj.img
    };
  }
  return null
};