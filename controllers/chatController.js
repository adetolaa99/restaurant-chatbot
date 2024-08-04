const UserSession = require("../models/userSession.js");

const menuItems = [
  { name: "Pizza", price: "₦4780" },
  { name: "Burger", price: "₦3250" },
  { name: "Chicken and Chips", price: "₦5125" },
  { name: "Shawarma", price: "₦3100" },
  { name: "Milkshake", price: "₦2500" },
];

const handleChat = async (message, sessionId) => {
  try {
    console.log(`Received message from session ${sessionId}: ${message}`);
    let userSession = await UserSession.findOne({ sessionId });
    console.log(`Found user session:`, userSession);
    if (!userSession) {
      userSession = new UserSession({ sessionId });
      await userSession.save();
    }

    let reply = "";

    // Input validation function
    const isValidInput = (input) => {
      return /^[0-9]{1,2}$/.test(input) || ["97", "98", "99"].includes(input);
    };

    if (!isValidInput(message)) {
      reply = "Invalid input! Please select a valid option (0-99, 97, 98, 99).";
    } else {
      switch (message) {
        case "1":
          reply = `Please select an item by number:<br>${menuItems
            .map((item, index) => `${index + 1}. ${item.name} - ${item.price}`)
            .join("<br>")}`;
          userSession.expectingItemSelection = true;
          break;
        case "99":
          if (userSession.currentOrder.length > 0) {
            reply = "Order placed!";
            userSession.orderHistory.push([...userSession.currentOrder]);
            userSession.currentOrder = [];
          } else {
            reply = "No order to place! Select 1 to place an order.";
          }
          userSession.expectingItemSelection = false;
          break;
        case "98":
          reply =
            userSession.orderHistory.length > 0
              ? `Order History:<br>${userSession.orderHistory
                  .map(
                    (order, index) => `Order ${index + 1}: ${order.join(", ")}`
                  )
                  .join("<br>")}`
              : "No order history!";
          break;
        case "97":
          reply =
            userSession.currentOrder.length > 0
              ? `Current Order:<br>${userSession.currentOrder.join(", ")}`
              : "No current order!";
          break;
        case "0":
          userSession.currentOrder = [];
          reply = "Order canceled!";
          userSession.expectingItemSelection = false;
          break;
        default:
          if (userSession.expectingItemSelection) {
            const itemIndex = parseInt(message, 10) - 1;
            if (itemIndex >= 0 && itemIndex < menuItems.length) {
              userSession.currentOrder.push(menuItems[itemIndex].name);
              reply = `${menuItems[itemIndex].name} added to order! Select more items or type 99 to checkout.`;
            } else {
              reply = "Invalid selection! Please select a valid item number.";
            }
          } else {
            reply = "Please select 1 to place an order.";
          }
      }
    }

    await userSession.save();

    console.log(`Sending reply: ${reply}`);
    return reply;
  } catch (error) {
    console.error("Error in handleChat:", error);
    return "An error occurred! Please try again.";
  }
};

module.exports = { handleChat };
