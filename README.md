# fed-assg-2
mokesell website
E-Commerce Product Display
Overview
This project is an e-commerce platform's product display feature, which dynamically fetches and displays products based on categories. Products are retrieved from an external API and filtered by category (e.g., Clothing, Electronics, Luxury Items, or All Products). The frontend dynamically adjusts based on the category specified in the page title, ensuring users see the relevant products without needing manual refresh or reconfiguration.

Features
Dynamic Category Detection: The category is automatically detected from the page title and products are fetched accordingly (e.g., "Clothing," "Electronics," "Luxury Items").
Product Display: Products are displayed in different sections such as "Trending Products," "Sale Products," and "Recent Products."
Responsive Design: The display adjusts seamlessly to various screen sizes, providing a mobile-friendly experience.
Error Handling: Proper error handling in case of a failed API request, ensuring users are informed in case of any issues fetching products.
Dependencies
This project uses the following technologies:

HTML/CSS: For structuring and styling the web page.
JavaScript: For dynamic content fetching and rendering of products.
API: The data is fetched from a REST API hosted on RestDB. You’ll need an API key to authenticate the requests.
API Configuration
API URL: https://hnggg-15bd.restdb.io/rest/items?max=2
API Key: 679587742e4264831ed2397c (Use your own API key if you'd like to test this with your setup)
Ensure the API key is correctly set in the JavaScript file (product.js).

Usage
Once the page loads, it will automatically check the title of the page to determine the product category and fetch the relevant products. If the page is titled "All Products," it will fetch all available products. The products are then displayed dynamically in the designated containers.

How the Page Works:
Category-Based Display: The script detects the page title and filters products accordingly.
Product Elements: Each product is displayed with an image, name, price, and condition.
Sections: Products are categorized into different sections: "Trending Products," "Sale Products," and "Recent Products."
Error Handling
If the API request fails or there’s an issue fetching the products, an error message is logged to the console.
