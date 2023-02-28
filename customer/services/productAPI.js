export class Service {
    getProducts = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: "https://63e864225f3e35d898f01fc9.mockapi.io/api/product",
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };
    getProductByID = async (id) => {
        try {
            const response = await axios({
                method: "GET",
                url: `https://63e864225f3e35d898f01fc9.mockapi.io/api/product/${id}`,
            });
            return response.data
        } catch (error) {
            console.log(error);
        }
    };
}