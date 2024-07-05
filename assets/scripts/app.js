class Product {
    constructor(title, image, desc, price) {
        this.title = title;
        this.image = image;
        this.desc = desc;
        this.price = price;
    }
}

class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;
        if (shouldRender) {
            this.render();
        }
    }

    render() {}

    createRootElement(tag, cssClasses, atrributes) {
        const rootElement = document.createElement(tag);
        if (cssClasses) {
            rootElement.className = cssClasses;
        }
        if (atrributes && atrributes.length > 0) {
            for (const attr of atrributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingCart extends Component {
    items = [];

    set cartItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `Total Order Amount: ${this.totalAmount.toFixed(
            2
        )}`;
    }

    get totalAmount() {
        const sum = this.items.reduce(
            (prevValue, curItem) => prevValue + curItem.price,
            0
        );
        return sum;
    }

    constructor(renderHookId) {
        super(renderHookId, false);
        this.render();
    }

    addProduct(product) {
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;
    }

    orderProducts = () => { //We can send this to constructor before calling render method
        console.log("ordered");
        console.log(this.items);
    };

    render() {
        const cartEl = this.createRootElement("section", "cart");
        cartEl.innerHTML = `
            <h2>Total Order Amount: ${0}</h2>
            <button>Order Now !</button>
        `;
        const orderButton = cartEl.querySelector("button");
        // orderButton.addEventListener("click", () => this.orderProducts());
        orderButton.addEventListener("click", this.orderProducts);
        this.totalOutput = cartEl.querySelector("h2");
        return cartEl;
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId, false);
        this.product = product;
        this.render();
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement("li", "product-item");
        prodEl.innerHTML = `
                <div>
                    <img src="${this.product.image}" alt="${this.product.title}">
                    <div class="product-item__content">
                        <h2>${this.product.title}</h2>
                        <h3>\$${this.product.price}</h3>
                        <p>${this.product.desc}</p>
                        <button>Add to cart</button>
                    </div>
                </div>
            `;
        const addCartButton = prodEl.querySelector("button");
        addCartButton.addEventListener("click", this.addToCart.bind(this));
    }
}

class ProductList extends Component {
    #products = [];

    constructor(renderHookId) {
        super(renderHookId);
        this.fetchProduct();
    }

    fetchProduct() {
        this.#products = [
            new Product(
                "A Pillow",
                "https://contents.mediadecathlon.com/p1749048/f0b275c3207e208e12771a5c385d3ff8/p1749048.jpg",
                "A soft pillow!",
                19.99
            ),
            new Product(
                "A Carpet",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ardabil_Carpet.jpg/397px-Ardabil_Carpet.jpg",
                "A carpet which you might like - or not.",
                89.99
            ),
        ];
        this.renderProducts();
    }

    renderProducts() {
        for (const prod of this.#products) {
            new ProductItem(prod, "prod-list");
        }
    }

    render() {
        this.createRootElement("ul", "product-list", [
            new ElementAttribute("id", "prod-list"),
        ]);
        if (this.products && this.products.length > 0) {
            this.renderProducts();
        }
    }
}

class Shop extends Component {
    constructor() {
        super();
    }

    render() {
        this.cart = new ShoppingCart("app");
        let pl = new ProductList("app");
    }
}

class App {
    static cart;

    static init() {
        const shop = new Shop();
        this.cart = shop.cart;
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();
