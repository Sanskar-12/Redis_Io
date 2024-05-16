const getProducts = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        products: {
          name: "clothes",
        },
      });
    }, 2000);
  });

const getProductById = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        product: {
          id: id,
          name: `Product ${id}`,
          price: Math.floor(Math.random() * id * 100),
        },
      });
    }, 2000);
  });

export { getProducts, getProductById };
