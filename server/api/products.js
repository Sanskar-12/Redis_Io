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

export { getProducts };
