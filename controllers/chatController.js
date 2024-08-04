/**
 * Chat Controller Module
 *
 * This module handles the chat functionality for a food ordering system.
 * It processes user inputs, manages user sessions, and generates appropriate responses.
 *
 * @module chatController
 */

const UserSession = require("../models/userSession.js");

/**
 * Array of menu items available for ordering.
 * @type {Array<{name: string, price: string}>}
 */
const menuItems = [
  { name: "Pizza", price: "₦4780" },
  { name: "Burger", price: "₦3250" },
  { name: "Chicken and Chips", price: "₦5125" },
  { name: "Shawarma", price: "₦3100" },
  { name: "Milkshake", price: "₦2500" },
];

/**
 * Handles incoming chat messages and generates appropriate responses.
 *
 * @async
 * @param {string} message - The user's input message.
 * @param {string} sessionId - The unique identifier for the user's session.
 * @returns {Promise<string>} The response message to be sent back to the user.
 */
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

    /**
     * Validates user input.
     * @param {string} input - The user's input to validate.
     * @returns {boolean} True if input is valid, false otherwise.
     */
    const isValidInput = (input) => {
      return /^[0-9]{1,2}$/.test(input) || ["97", "98", "99"].includes(input);
    };

    if (!isValidInput(message)) {
      reply = "Invalid input! Please select a valid option (0-99, 97, 98, 99).";
    } else {
      switch (message) {
        case "1":
          // Display menu and set expectingItemSelection to true
          reply = `Please select an item by number:<br>${menuItems
            .map((item, index) => `${index + 1}. ${item.name} - ${item.price}`)
            .join("<br>")}`;
          userSession.expectingItemSelection = true;
          break;
        case "99":
          // Place order if there are items in the current order
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
          // Display order history
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
          // Display current order
          reply =
            userSession.currentOrder.length > 0
              ? `Current Order:<br>${userSession.currentOrder.join(", ")}`
              : "No current order!";
          break;
        case "0":
          // Cancel current order
          userSession.currentOrder = [];
          reply = "Order canceled!";
          userSession.expectingItemSelection = false;
          break;
        default:
          if (userSession.expectingItemSelection) {
            // Add selected item to current order
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
