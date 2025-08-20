const menu = document.getElementById("menu");
const categories = document.querySelectorAll(".sidebar ul li");
const sidebar = document.getElementById("sidebar");

// const items = [
//     { name: "Coke", category: "Drinks", price: "$1.99", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Pepsi", category: "Drinks", price: "$2.50", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Lemonade", category: "Drinks", price: "$3.00", img: "./assets/img/can-592367_1280.jpg" },

//     { name: "Margherita Pizza", category: "Entrées", price: "$7.99", img: "./assets/img/pizza-6478478_1280.jpg" },
//     { name: "Cheeseburger", category: "Burgers", price: "$5.50", img: "./assets/img/pizza-6478478_1280.jpg" },
//     { name: "Veggie Pasta", category: "Pasta", price: "$6.99", img: "./assets/img/pizza-6478478_1280.jpg" },

//     { name: "Ice Cream", category: "Desserts", price: "$3.50", img: "./assets/img/bowl-1932375_1280.jpg" },
//     { name: "Red Velvet Cake", category: "Desserts", price: "$4.00", img: "./assets/img/bowl-1932375_1280.jpg" },

//     { name: "Red Wine", category: "Wine", price: "$12.99", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "White Wine", category: "Wine", price: "$14.50", img: "./assets/img/can-592367_1280.jpg" },

//     { name: "Beer", category: "Beer", price: "$4.50", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Stout", category: "Beer", price: "$6.00", img: "./assets/img/can-592367_1280.jpg" },

//     { name: "Grilled Salmon", category: "Seafood", price: "$15.99", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Caesar Salad", category: "Salads", price: "$6.50", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Club Sandwich", category: "Sandwiches", price: "$5.75", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Ribeye Steak", category: "Steaks", price: "$18.99", img: "./assets/img/can-592367_1280.jpg" },

//     { name: "Sushi", category: "Asian Cuisine", price: "$12.50", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Tacos", category: "Mexican", price: "$4.99", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Chicken Curry", category: "Indian", price: "$9.50", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Pancakes", category: "Breakfast", price: "$5.25", img: "./assets/img/can-592367_1280.jpg" },
//     { name: "Tofu Stir-fry", category: "Vegan", price: "$7.99", img: "./assets/img/can-592367_1280.jpg" }
// ];

const items = [
    { name: "Coke valo jinish shovar khawa uchit", category: "Drinks", price: "$1.99", img: "./assets/img/can-592367_1280.jpg", description: "A refreshing carbonated soft drink perfect for any occasion. Coke valo jinish shovar khawa uchitCoke valo jinish shovar khawa uchitCoke valo jinish shovar khawa uchit A refreshing carbonated soft drink perfect for any occasion. Coke valo jinish shovar khawa uchitCoke valo jinish shovar khawa uchitCoke valo jinish shovar khawa uchit", calorie: 140, quantity: 1 },
    { name: "Pepsi", category: "Drinks", price: "$2.50", img: "./assets/img/can-592367_1280.jpg", description: "Popular cola beverage with a bold and refreshing taste.", calorie: 150, quantity: 1 },
    { name: "Lemonade", category: "Drinks", price: "$3.00", img: "./assets/img/can-592367_1280.jpg", description: "A tangy and sweet lemonade made from fresh lemons.", calorie: 120, quantity: 1 },

    { name: "Margherita Pizza", category: "Entrées", price: "$7.99", img: "./assets/img/pizza-6478478_1280.jpg", description: "Classic Margherita pizza topped with fresh tomatoes, mozzarella, and basil.", calorie: 800, quantity: 1 },
    { name: "Cheeseburger", category: "Burgers", price: "$5.50", img: "./assets/img/pizza-6478478_1280.jpg", description: "Juicy beef patty with melted cheese in a soft bun, served with lettuce and tomato.", calorie: 550, quantity: 1 },
    { name: "Veggie Pasta", category: "Pasta", price: "$6.99", img: "./assets/img/pizza-6478478_1280.jpg", description: "Healthy and delicious pasta with mixed vegetables and a light sauce.", calorie: 450, quantity: 1 },

    { name: "Ice Cream", category: "Desserts", price: "$3.50", img: "./assets/img/bowl-1932375_1280.jpg", description: "Creamy and sweet ice cream available in various flavors.", calorie: 200, quantity: 1 },
    { name: "Red Velvet Cake", category: "Desserts", price: "$4.00", img: "./assets/img/bowl-1932375_1280.jpg", description: "Moist and rich red velvet cake with creamy frosting.", calorie: 400, quantity: 1 },

    { name: "Red Wine", category: "Wine", price: "$12.99", img: "./assets/img/can-592367_1280.jpg", description: "A fine selection of red wine with a smooth finish.", calorie: 125, quantity: 1 },
    { name: "White Wine", category: "Wine", price: "$14.50", img: "./assets/img/can-592367_1280.jpg", description: "Crisp and refreshing white wine with a fruity aroma.", calorie: 120, quantity: 1 },

    { name: "Beer", category: "Beer", price: "$4.50", img: "./assets/img/can-592367_1280.jpg", description: "Chilled beer with a light and crisp taste, perfect for relaxing.", calorie: 150, quantity: 1 },
    { name: "Stout", category: "Beer", price: "$6.00", img: "./assets/img/can-592367_1280.jpg", description: "Dark and rich stout with deep flavors and a creamy head.", calorie: 210, quantity: 1 },

    { name: "Grilled Salmon", category: "Seafood", price: "$15.99", img: "./assets/img/can-592367_1280.jpg", description: "Tender grilled salmon seasoned with herbs, served with a lemon wedge.", calorie: 600, quantity: 1 },
    { name: "Caesar Salad", category: "Salads", price: "$6.50", img: "./assets/img/can-592367_1280.jpg", description: "Classic Caesar salad with crisp romaine, croutons, and creamy dressing.", calorie: 350, quantity: 1 },
    { name: "Club Sandwich", category: "Sandwiches", price: "$5.75", img: "./assets/img/can-592367_1280.jpg", description: "Triple-layered sandwich with turkey, bacon, lettuce, and tomato.", calorie: 450, quantity: 1 },
    { name: "Ribeye Steak", category: "Steaks", price: "$18.99", img: "./assets/img/can-592367_1280.jpg", description: "Juicy ribeye steak grilled to perfection with a side of mashed potatoes.", calorie: 800, quantity: 1 },

    { name: "Sushi", category: "Asian Cuisine", price: "$12.50", img: "./assets/img/can-592367_1280.jpg", description: "Assorted sushi rolls with fresh fish, rice, and seaweed.", calorie: 300, quantity: 1 },
    { name: "Tacos", category: "Mexican", price: "$4.99", img: "./assets/img/can-592367_1280.jpg", description: "Soft tacos filled with seasoned meat, cheese, and fresh vegetables.", calorie: 250, quantity: 2 },
    { name: "Chicken Curry", category: "Indian", price: "$9.50", img: "./assets/img/can-592367_1280.jpg", description: "Spicy chicken curry cooked in a rich tomato-based sauce.", calorie: 500, quantity: 1 },
    { name: "Pancakes", category: "Breakfast", price: "$5.25", img: "./assets/img/can-592367_1280.jpg", description: "Fluffy pancakes served with syrup and fresh berries.", calorie: 400, quantity: 3 },
    { name: "Tofu Stir-fry", category: "Vegan", price: "$7.99", img: "./assets/img/can-592367_1280.jpg", description: "Healthy tofu stir-fried with mixed vegetables in a light soy sauce.", calorie: 350, quantity: 1 }
];



function displayItems(filter = null) {
    menu.innerHTML = "";
    items.filter(item => !filter || filter === "All" || item.category === filter).forEach(item => {
        const div = document.createElement("div");
        div.classList.add("menu-item");
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            
            
            <h3 class="menu-name category">${item.category}</h3>
            <h3 class="menu-name">${item.name}</h3>
            <p class="menu-description">${item.description}</p>
            <hr>
            <div>
                <p class="menu-name">${item.calorie}cal</p>
                <p class="menu-name">${item.price}</p>
            </div>
            <div class="menu-calc">
                <div><button class="minus menu-quantity" onclick="handleMinus(this)">-</button><span class="menu-quantity">1</span><button class="plus menu-quantity" onclick="handlePlus(this)">+</button> </div>
                <button class="buy-btn">Buy</button>
            </div>
        `;
        menu.appendChild(div);
    });
    document.querySelectorAll(".menu-name").forEach(item => {
        // console.log(item.parentElement.clientWidth)
        while (item.scrollWidth > item.parentElement.clientWidth-20) {
            let currentSize = window.getComputedStyle(item).fontSize;
            let newSize = parseFloat(currentSize) - .5; // Reduce font size
            if (newSize < 1) break; // Stop if it gets too small
            item.style.fontSize = newSize + "px";
        }
    });
    document.querySelectorAll(".menu-description").forEach(item => {
        // console.log(item.parentElement.clientHeight)
        // console.log(item.scrollHeight)
        while (item.scrollHeight > 50) {
            let currentSize = window.getComputedStyle(item).fontSize;
            let newSize = parseFloat(currentSize) - .5; // Reduce font size
            if (newSize < 1) break; // Stop if it gets too small
            item.style.fontSize = newSize + "px";
        }
    });

    
    
}

const handlePlus=(item)=>{
    console.log(item)
    console.log(item.innerText)
    let cal=item.parentElement.parentElement.parentElement.childNodes[11].firstElementChild.innerText
    let price=item.parentElement.parentElement.parentElement.childNodes[11].lastElementChild.innerText
    let qty=item.parentElement.childNodes[1].innerText
    const unit_price=parseFloat(price.replace("$",""))/parseInt(qty)
    const unit_cal=parseFloat(cal)/parseInt(qty);
    qty=parseInt(qty)+1;
    const new_cal=unit_cal*qty;
    const new_price=unit_price*qty
    item.parentElement.parentElement.parentElement.childNodes[11].firstElementChild.innerText=`${new_cal}cal`
    item.parentElement.parentElement.parentElement.childNodes[11].lastElementChild.innerText=`$${new_price.toFixed(2)}`
    item.parentElement.childNodes[1].innerText=qty
    console.log(cal)
    console.log(price)  
}
const handleMinus=(item)=>{
    console.log(item)
    console.log(item.innerText)
    console.log(item.innerText)
    let cal=item.parentElement.parentElement.parentElement.childNodes[11].firstElementChild.innerText
    let price=item.parentElement.parentElement.parentElement.childNodes[11].lastElementChild.innerText
    let qty=item.parentElement.childNodes[1].innerText
    const unit_price=parseFloat(price.replace("$",""))/parseInt(qty)
    const unit_cal=parseFloat(cal)/parseInt(qty);
    if(parseInt(qty)>1){
        qty=parseInt(qty)-1;
        const new_cal=unit_cal*qty;
        const new_price=unit_price*qty
        item.parentElement.parentElement.parentElement.childNodes[11].firstElementChild.innerText=`${new_cal}cal`
        item.parentElement.parentElement.parentElement.childNodes[11].lastElementChild.innerText=`$${new_price.toFixed(2)}`
        item.parentElement.childNodes[1].innerText=qty
        console.log(unit_price)
        console.log(price)  
    }
}

const filterMenu=(category, element)=> {
    displayItems(category);
    categories.forEach(li => li.classList.remove("active"));
    element.classList.add("active");
    
}
    function toggleSidebar() {
        sidebar.classList.toggle("show");
    }
    document.addEventListener("DOMContentLoaded", () => {
        displayItems("All")
}
);

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('clock').innerText = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();
