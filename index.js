import { menuArray } from '/data.js'

const itemContainer = document.getElementById('item-container')
const placeOrderBtn = document.getElementById('order-btn')
const payBtn = document.getElementById('pay-btn')
function renderMenu(){
    itemContainer.innerHTML = menuArray.map(function(item){
        return `  <div class="menu-item">
                        <p class="item-pic">${item.emoji}</p>
                        <div class="item-text">
                            <h3>${item.name}</h3>
                            <p class="item-info">${item.info.join(", ")}</p>
                            <p class="item-price">$${item.price}</p>
                        </div>
                    <button class="add-btn" id="add-btn" data-add="${item.id}">+</button>
                </div>`
    }).join("")
}

renderMenu()

// addbutton event lisener
document.addEventListener('click', function(e){
    if(e.target.classList.contains('add-btn')){
        const itemId = e.target.dataset.add
        const numericItemId = parseInt(itemId, 10)
        const targetItemObj = menuArray.find(item => item.id === numericItemId)  
        
         if (targetItemObj) {
            handleAddBtn(targetItemObj)
            updateTotalPrice(targetItemObj.price)
            //show payment section
            document.getElementById("checkout-section").classList.remove("hidden")
        } else {
            console.error("Item not found in menuArray")
        }
    }else if (e.target.classList.contains('remove-btn')){
        const itemId = e.target.dataset.remove
        const numericItemId = parseInt(itemId, 10)
        const targetItemObj = menuArray.find(item => item.id === numericItemId)
         if (targetItemObj) {
            handleRemoveBtn(targetItemObj.price)
            removeLineItem(targetItemObj)  
        } else {
            console.error("Item not found in menuArray");
        }
    }else if (e.target.classList.contains('order-btn')){
        const totalPriceEl = document.getElementById("total-price")
        const currentTotalPriceString = totalPriceEl.innerHTML 
        const currentTotalPrice = parseFloat(currentTotalPriceString.replace('$', '') || 0)
        if(currentTotalPrice > 0){
            console.log("place order")
            showPaymentModal()
        }else{
            console.log("nothing here yet")
        }
    } else if (e.target.classList.contains('pay-btn')){
        const paymentForm = document.getElementById("payment-form")
        const isValid = paymentForm.checkValidity()
        if(isValid){
            e.preventDefault()
            hidePaymentModal()
            const customerName = document.getElementById("name").value
            console.log(customerName)
            showOrderMsg(customerName)
        }
        
    }
})

function handleAddBtn(item){
    const itemListHtml = []
    itemListHtml.push(`
        <div class="line-item" >
            <p class="checkout-name" id="checkout-name">${item.name}</p>
            <button class="remove-btn" id="remove-btn" data-remove="${item.id}">remove</button>
            <p class="price" id="item-price">$${item.price}</p>
        </div>`)
    document.getElementById("item-list").innerHTML += itemListHtml
      
}

function handleRemoveBtn(price){
    const totalPriceEl = document.getElementById("total-price");
     
    // Get the current total price
    const currentTotalPrice = parseFloat(totalPriceEl.innerHTML.replace('$', '') || 0);
    // Subtract the price of the removed item from the current total
    const newTotalPrice = currentTotalPrice - parseFloat(price);
   // Update the total price element with the new total formatted as currency
    totalPriceEl.innerHTML = "$" + newTotalPrice.toFixed(2);   
}


function removeLineItem(item){

    const itemList = document.getElementById("item-list");
    const itemToRemove = itemList.querySelector(`[data-remove="${item.id}"]`).parentElement

    if (itemToRemove) {
        // Remove the parent element (the entire line item div) from the DOM
        itemList.removeChild(itemToRemove);
    } else {
        console.error("Item not found in the item list.");
    }
}



function updateTotalPrice(price){
  
    const totalPriceEl = document.getElementById("total-price")
    const currentTotalPriceString = totalPriceEl.innerHTML 
// Extract the numeric part of the current total price
    const currentTotalPrice = parseFloat(currentTotalPriceString.replace('$', '') || 0);
// Add the new price to the current total
    const newTotalPrice = currentTotalPrice + parseFloat(price);
// Update the total price element with the new total formatted as currency
    totalPriceEl.innerHTML = "$" + newTotalPrice.toFixed(2);
}

function showPaymentModal(){
    const paymentModal = document.getElementById("payment-modal")
    paymentModal.classList.remove("hidden")
}
function hidePaymentModal(){
    const paymentModal = document.getElementById("payment-modal")
    paymentModal.classList.add("hidden")
}

function showOrderMsg(name){
    const orderCompleteDiv = document.getElementById("order-complete")
    orderCompleteDiv.classList.remove("hidden")
    orderCompleteDiv.innerHTML=`
            <p class="complete-msg" id="complete-msg">
                    Thanks, ${name}! Your order is on its way!
            </p>`
    console.log(orderCompleteDiv)
    
}